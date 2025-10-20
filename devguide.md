## Developer Quick Start

This guide is for new contributors who just cloned the repo. Keep it simple, get running fast.

### Prerequisites
- **Node.js**: Use the same version as the team 
- **npm**: Use the version bundled with your Node. Prefer `npm ci` over `npm install`.
- **MongoDB**: Local MongoDB or a connection string.

### 1) Clone and install dependencies
```bash
git clone <repo-url>
cd eCommerce_App

# Install exactly what's in the lockfile
cd backend
npm ci
```

If `npm ci` fails because of Node/npm mismatch, align your versions (use `nvm use`) and try again.

### 2) Environment variables
Copy the sample file and edit values:
```bash
cp backend/.env.example backend/.env
```
Set at least these keys:
- **HOST**: e.g. `127.0.0.1`
- **PORT**: e.g. `3000`
- **NODE_ENV**: `development`
- **MONGODB_URI**: your MongoDB connection string
- **ADMIN_JWT_SECRET**: strong random string
- **ADMIN_REFRESH_JWT_SECRET**: strong random string
- **CUSTOMER_JWT_SECRET**: strong random string
- **CUSTOMER_REFRESH_JWT_SECRET**: strong random string

### 3) Run the backend
```bash
cd backend
npm run dev
```
Server should start without modifying `package-lock.json`.

### 4) Seed data (optional)
From `backend/` you can seed dev data:
```bash
npm run seed:admin
npm run seed:customers
npm run seed:all
npm run seed:reset
```

### 5) Tests
```bash
cd backend
npm test
```

### Common issues
- **UNMET DEPENDENCY / module not found**: run `npm ci` inside `backend/`.
- **`package-lock.json` changes**: use `npm ci` and align Node/npm with the team (`nvm use`).
- **`sharp` install errors on WSL/Linux**: install build tools (see Prerequisites), then `npm ci` again.

That’s it—ping the team if anything here doesn’t work as expected.


