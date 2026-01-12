/**
 * Rollback seeded products (per-category) created by seedProductsCloudinaryByCategory.js
 *
 * This script deletes ONLY products that match the seeder's identifying patterns,
 * and deletes the associated Cloudinary image using `imagePublicId` when present.
 *
 * Safety:
 * - Defaults to --dry-run (no changes).
 * - Requires --yes to actually delete.
 *
 * Usage:
 *   node scripts/rollbackSeedProductsCloudinaryByCategory.js --category=Electronics --dry-run
 *   node scripts/rollbackSeedProductsCloudinaryByCategory.js --category=Electronics --yes
 *
 * Optional narrowing:
 *   --seed-tag=1736700000000   (matches titles containing that seed tag)
 *   --since=2026-01-12T00:00:00Z
 *   --until=2026-01-12T23:59:59Z
 *   --env-file=/path/to/backend/.env
 */

import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.join(__dirname, '..');

function parseArgs(argv) {
  const args = argv.slice(2);
  const getValue = (prefix, fallback = undefined) => {
    const found = args.find((a) => a.startsWith(prefix));
    if (!found) return fallback;
    const [, value] = found.split('=');
    return value ?? fallback;
  };
  const hasFlag = (flag) => args.includes(flag);

  return {
    category: getValue('--category', ''),
    seedTag: getValue('--seed-tag', ''),
    since: getValue('--since', ''),
    until: getValue('--until', ''),
    envFile: getValue('--env-file', path.join(backendDir, '.env')),
    dryRun: hasFlag('--dry-run') || !hasFlag('--yes'),
    yes: hasFlag('--yes')
  };
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseDateOrNull(s) {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function main() {
  const { category, seedTag, since, until, envFile, dryRun, yes } = parseArgs(process.argv);

  dotenv.config({ path: envFile });

  if (!category) {
    console.error('Missing --category. Example: --category=Electronics');
    process.exitCode = 1;
    return;
  }

  const sinceDate = parseDateOrNull(since);
  const untilDate = parseDateOrNull(until);
  if (since && !sinceDate) {
    console.error(`Invalid --since: ${since}`);
    process.exitCode = 1;
    return;
  }
  if (until && !untilDate) {
    console.error(`Invalid --until: ${until}`);
    process.exitCode = 1;
    return;
  }

  // Lazy imports after dotenv
  const { default: connect } = await import('../config/dbConnection.js');
  const { default: Product } = await import('../models/Product.js');
  const { deleteImageByPublicId } = await import('../utils/cloudinary.js');
  const mongoose = (await import('mongoose')).default;

  await connect();

  // Identify only our seeded products:
  // Title format: `${category} Seed ${seedTag} #<NN> <suffix>`
  // Description contains: `Generated image uploaded to Cloudinary.`
  const titlePrefix = `^${escapeRegExp(category)} Seed `;
  const titleRegex = seedTag
    ? new RegExp(`${titlePrefix}${escapeRegExp(seedTag)} #\\d{2} `)
    : new RegExp(`${titlePrefix}\\d{13} #\\d{2} `);

  const query = {
    category,
    title: { $regex: titleRegex },
    description: { $regex: /Generated image uploaded to Cloudinary\./ }
  };

  if (sinceDate || untilDate) {
    query.createdAt = {};
    if (sinceDate) query.createdAt.$gte = sinceDate;
    if (untilDate) query.createdAt.$lte = untilDate;
  }

  const products = await Product.find(query).select('_id title category image imagePublicId createdAt');

  console.log('--- Rollback Seeded Products (Cloudinary) ---');
  console.log('Category:', category);
  console.log('Seed tag:', seedTag || '(any)');
  console.log('Since:', sinceDate ? sinceDate.toISOString() : '(none)');
  console.log('Until:', untilDate ? untilDate.toISOString() : '(none)');
  console.log('Env file:', envFile);
  console.log('Matched products:', products.length);
  console.log('Mode:', dryRun ? 'DRY RUN (no deletes)' : 'DELETE');

  if (products.length === 0) {
    await mongoose.disconnect();
    return;
  }

  if (dryRun) {
    for (const p of products) {
      console.log(`[DRY RUN] Would delete: id=${p._id} title="${p.title}" imagePublicId=${p.imagePublicId || '(none)'}`);
    }
    await mongoose.disconnect();
    return;
  }

  if (!yes) {
    console.error('Refusing to delete without --yes.');
    process.exitCode = 1;
    await mongoose.disconnect();
    return;
  }

  let deletedProducts = 0;
  let deletedImages = 0;
  let failedImages = 0;

  for (const p of products) {
    try {
      if (p.imagePublicId) {
        try {
          await deleteImageByPublicId(p.imagePublicId);
          deletedImages++;
        } catch (err) {
          failedImages++;
          console.warn(`[WARN] Failed to delete Cloudinary imagePublicId=${p.imagePublicId}: ${err?.message || err}`);
        }
      }

      await Product.deleteOne({ _id: p._id });
      deletedProducts++;
      console.log(`[OK] Deleted product ${p._id}`);
    } catch (err) {
      console.error(`[FAIL] Delete product ${p._id}: ${err?.message || err}`);
    }
  }

  console.log('--- Rollback Summary ---');
  console.log({ matched: products.length, deletedProducts, deletedImages, failedImages });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Rollback script crashed:', err?.message || err);
  process.exitCode = 1;
});


