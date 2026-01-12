import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendDir = path.join(__dirname, '..');

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  const getValue = (prefix, fallback = undefined) => {
    const found = argv.find((a) => a.startsWith(prefix));
    if (!found) return fallback;
    const [, value] = found.split('=');
    return value ?? fallback;
  };

  return {
    dryRun: args.has('--dry-run'),
    deleteLocal: args.has('--delete-local'),
    limit: Number(getValue('--limit', '0')) || 0,
    skipMissing: args.has('--skip-missing'),
    envFile: getValue('--env-file', path.join(backendDir, '.env')),
    timeoutMs: Number(getValue('--timeout-ms', '120000')) || 120000
  };
}

function isLegacyLocalImage(image) {
  return typeof image === 'string' && image.startsWith('uploads/products/');
}

async function main() {
  const { dryRun, deleteLocal, limit, skipMissing, envFile, timeoutMs } = parseArgs(process.argv);

  // IMPORTANT:
  // dbConnection.js reads MONGODB_URI at import-time, so we must load env BEFORE importing it.
  dotenv.config({ path: envFile });

  const { default: connect } = await import('../config/dbConnection.js');
  const { default: Product } = await import('../models/Product.js');
  const { uploadImageBuffer } = await import('../utils/cloudinary.js');

  console.log('--- Cloudinary Migration: Product Images ---');
  console.log('Options:', { dryRun, deleteLocal, limit: limit || 'no-limit', skipMissing, envFile, timeoutMs });

  await connect();

  const query = { image: { $regex: '^uploads/products/' } };
  const products = await Product.find(query).limit(limit || 0);

  console.log(`Found ${products.length} products with legacy local images.`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const legacyPath = product.image;

    if (!isLegacyLocalImage(legacyPath)) {
      skipped++;
      continue;
    }

    const absolutePath = path.join(backendDir, legacyPath);

    try {
      console.log(`Reading ${product._id} from disk: ${legacyPath}`);
      const fileBuffer = await fs.readFile(absolutePath);
      if (!fileBuffer || fileBuffer.length === 0) {
        throw new Error('Local file is empty');
      }

      // Deterministic public_id: safe to re-run (overwrite=true)
      const publicId = `product_${product._id.toString()}`;

      if (dryRun) {
        console.log(`[DRY RUN] Would upload ${legacyPath} -> Cloudinary public_id=${publicId}`);
        migrated++;
        continue;
      }

      console.log(`Uploading ${product._id} to Cloudinary (timeout ${timeoutMs}ms)...`);
      const uploaded = await Promise.race([
        uploadImageBuffer(fileBuffer, {
          public_id: publicId,
          overwrite: true
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Cloudinary upload timed out after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);

      console.log(`Saving ${product._id} to MongoDB...`);
      product.image = uploaded.secure_url;
      product.imagePublicId = uploaded.public_id;
      await product.save();

      if (deleteLocal) {
        try {
          await fs.unlink(absolutePath);
        } catch (deleteErr) {
          console.warn(`Warning: failed to delete local file: ${absolutePath}`, deleteErr?.message || deleteErr);
        }
      }

      migrated++;
      console.log(`Migrated ${product._id}: ${legacyPath} -> ${uploaded.secure_url}`);
    } catch (err) {
      failed++;
      const msg = err?.message || String(err);

      if (skipMissing && (msg.includes('ENOENT') || msg.toLowerCase().includes('no such file'))) {
        skipped++;
        console.warn(`Skipped missing file for ${product._id}: ${absolutePath}`);
        continue;
      }

      console.error(`Failed ${product._id} (${legacyPath}):`, msg);
    }
  }

  const remaining = await Product.countDocuments(query);

  console.log('--- Migration Summary ---');
  console.log({ migrated, skipped, failed, remainingLegacyImages: remaining });

  if (!dryRun && remaining > 0) {
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error('Migration script crashed:', err);
  process.exitCode = 1;
});


