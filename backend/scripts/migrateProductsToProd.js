/**
 * One-Time Product Migration: Development → Production
 * 
 * Copies all products from the development database to production.
 * Does NOT copy: customers, admins, orders, notifications, audit logs.
 * 
 * Safety:
 * - Defaults to dry-run mode (no changes)
 * - Requires --yes flag to actually migrate
 * - Skips products that already exist in production (based on title+category)
 * - Preserves Cloudinary image URLs (no re-upload needed)
 * 
 * Usage:
 *   node scripts/migrateProductsToProd.js           # Dry-run (preview)
 *   node scripts/migrateProductsToProd.js --yes    # Actually migrate
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// =============================================================================
// CONFIGURATION
// =============================================================================

const DEV_URI = process.env.MONGODB_URI_DEV;
const PROD_URI = process.env.MONGODB_URI_PROD;

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--yes');

// =============================================================================
// PRODUCT SCHEMA (inline to avoid import issues with different connections)
// =============================================================================

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// =============================================================================
// MAIN MIGRATION FUNCTION
// =============================================================================

async function migrateProducts() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  PRODUCT MIGRATION: Development → Production');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no changes will be made)' : '🚀 LIVE MIGRATION'}`);
  console.log('');

  // Validate environment variables
  if (!DEV_URI) {
    console.error('❌ MONGODB_URI_DEV is not set in .env file');
    process.exit(1);
  }
  if (!PROD_URI) {
    console.error('❌ MONGODB_URI_PROD is not set in .env file');
    process.exit(1);
  }

  // Prevent accidental same-database migration
  if (DEV_URI === PROD_URI) {
    console.error('❌ DEV and PROD URIs are the same! Aborting.');
    process.exit(1);
  }

  let devConnection = null;
  let prodConnection = null;

  try {
    // =========================================================================
    // STEP 1: Connect to Development Database
    // =========================================================================
    console.log('📦 Connecting to DEVELOPMENT database...');
    devConnection = await mongoose.createConnection(DEV_URI).asPromise();
    console.log('✅ Connected to development database');

    const DevProduct = devConnection.model('Product', productSchema);

    // =========================================================================
    // STEP 2: Fetch all products from development
    // =========================================================================
    console.log('\n📥 Fetching products from development...');
    const devProducts = await DevProduct.find({}).lean();
    console.log(`   Found ${devProducts.length} products in development`);

    if (devProducts.length === 0) {
      console.log('\n⚠️  No products to migrate. Exiting.');
      return;
    }

    // Show preview of products
    console.log('\n📋 Products to migrate:');
    console.log('─────────────────────────────────────────────────────────────────');
    devProducts.forEach((p, i) => {
      console.log(`   ${i + 1}. [${p.category}] ${p.title} - $${p.price} (stock: ${p.stock})`);
    });
    console.log('─────────────────────────────────────────────────────────────────');

    // =========================================================================
    // STEP 3: Disconnect from development
    // =========================================================================
    await devConnection.close();
    devConnection = null;
    console.log('\n📦 Disconnected from development database');

    // =========================================================================
    // STEP 4: Connect to Production Database
    // =========================================================================
    console.log('\n📦 Connecting to PRODUCTION database...');
    prodConnection = await mongoose.createConnection(PROD_URI).asPromise();
    console.log('✅ Connected to production database');

    const ProdProduct = prodConnection.model('Product', productSchema);

    // =========================================================================
    // STEP 5: Check existing products in production
    // =========================================================================
    const existingCount = await ProdProduct.countDocuments();
    console.log(`   Production currently has ${existingCount} products`);

    // =========================================================================
    // STEP 6: Migrate products (or dry-run)
    // =========================================================================
    if (dryRun) {
      console.log('\n🔍 DRY RUN - No changes will be made');
      console.log('   To actually migrate, run: node scripts/migrateProductsToProd.js --yes');
    } else {
      console.log('\n🚀 Starting migration...');
      
      let migrated = 0;
      let skipped = 0;
      let failed = 0;

      for (const product of devProducts) {
        try {
          // Remove _id and __v to create fresh documents
          const { _id, __v, ...productData } = product;
          
          // Reset timestamps for production
          productData.createdAt = new Date();
          productData.updatedAt = new Date();

          // Check if product already exists (by title + category)
          const existing = await ProdProduct.findOne({
            title: productData.title,
            category: productData.category
          });

          if (existing) {
            console.log(`   ⏭️  Skipped (exists): [${productData.category}] ${productData.title}`);
            skipped++;
            continue;
          }

          // Insert new product
          await ProdProduct.create(productData);
          console.log(`   ✅ Migrated: [${productData.category}] ${productData.title}`);
          migrated++;

        } catch (error) {
          // Handle duplicate key errors gracefully
          if (error.code === 11000) {
            console.log(`   ⏭️  Skipped (duplicate): [${product.category}] ${product.title}`);
            skipped++;
          } else {
            console.error(`   ❌ Failed: [${product.category}] ${product.title} - ${error.message}`);
            failed++;
          }
        }
      }

      // =========================================================================
      // STEP 7: Report summary
      // =========================================================================
      const finalCount = await ProdProduct.countDocuments();

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('  MIGRATION COMPLETE');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`   ✅ Migrated: ${migrated}`);
      console.log(`   ⏭️  Skipped:  ${skipped}`);
      console.log(`   ❌ Failed:   ${failed}`);
      console.log('───────────────────────────────────────────────────────────────');
      console.log(`   Production now has ${finalCount} products`);
      console.log('═══════════════════════════════════════════════════════════════');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up connections
    if (devConnection) {
      await devConnection.close();
    }
    if (prodConnection) {
      await prodConnection.close();
    }
    console.log('\n📦 All database connections closed');
  }
}

// =============================================================================
// RUN MIGRATION
// =============================================================================

migrateProducts().catch((err) => {
  console.error('Migration script crashed:', err);
  process.exit(1);
});

