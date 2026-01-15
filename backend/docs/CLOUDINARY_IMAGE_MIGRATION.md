# Cloudinary Image Uploads + One-Time Migration (Summary)

This project originally stored product images on the server filesystem under `backend/uploads/` and served them via `GET /uploads/*`.
It has been updated to store **new** product images in **Cloudinary**, and includes a **one-time migration script** to move existing local images to Cloudinary and update MongoDB.

## What changed

### 1) Upload path (Create/Update)
- **Before**: upload → write to disk (`uploads/products/...`) → store local path in MongoDB.
- **Now**: upload → process in-memory (Sharp) → upload to **Cloudinary** → store **Cloudinary URL** in MongoDB.

### 2) Product model fields
- `Product.image` remains a **string** (no frontend breaking change). It is now typically a **Cloudinary URL**.
- `Product.imagePublicId` was added to store the Cloudinary `public_id` so the app can delete old Cloudinary assets on update/delete.
- Validation was relaxed to accept either:
  - legacy local path (`uploads/products/...`) during migration, or
  - a URL (`http://` / `https://`) after migration.

### 3) Cleanup behavior
- **Update product image**: the old Cloudinary asset is deleted using the previous `imagePublicId` (only after DB update succeeds).
- **Delete product**: the Cloudinary asset is deleted using `imagePublicId`.

## One-time migration (local → Cloudinary)

The migration script uploads products whose `image` starts with `uploads/products/` to Cloudinary and updates MongoDB:
- Updates:
  - `image` → Cloudinary `secure_url`
  - `imagePublicId` → Cloudinary `public_id`
- Optional: deletes the local file after successful DB update.

### Commands
Run from `backend/`:

- Dry-run (no DB changes, no uploads):
  - `npm run migrate:cloudinary:dry-run`
- Migrate one item (safety check):
  - `npm run migrate:cloudinary -- --limit=1`
- Migrate everything:
  - `npm run migrate:cloudinary`
- Migrate + delete local files after each successful DB update:
  - `npm run migrate:cloudinary -- --delete-local`

After migrating, run dry-run again to confirm:
- `Found 0 products with legacy local images.`

## Cutover: disable local `/uploads`

Static serving of `/uploads` is gated by `SERVE_LOCAL_UPLOADS`:
- `SERVE_LOCAL_UPLOADS=true` → `/uploads` is served (legacy support)
- `SERVE_LOCAL_UPLOADS=false` → `/uploads` is not served (Cloudinary-only)

## Security note
If any secrets (MongoDB URI password, Cloudinary API secret, JWT secrets) were ever pasted into chat/logs, treat them as compromised and rotate them.

## Summary (minimal)
- Uploads now go **to Cloudinary**; Mongo stores **`image` URL + `imagePublicId`**.
- A one-time script migrates `uploads/products/*` images and updates Mongo.
- After migration, set **`SERVE_LOCAL_UPLOADS=false`** to enforce Cloudinary-only.


