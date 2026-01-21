/**
 * Production Admin Creation Script
 * 
 * Creates an admin user using the existing Zod validation schema.
 * Reuses registerSchema from authSchemas.js for validation.
 * 
 * Usage:
 *   NODE_ENV=production \
 *   ADMIN_NAME="John Doe" \
 *   ADMIN_EMAIL="admin@example.com" \
 *   ADMIN_PHONE="0771234567" \
 *   ADMIN_PASSWORD="SecurePassdgw123!" \
 *   node scripts/createProdAdmin.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Import existing validation schema (DRY - single source of truth)
import { registerSchema } from '../validation/schemas/authSchemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// =============================================================================
// ADMIN SCHEMA (inline to avoid import issues with different connections)
// =============================================================================

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin', immutable: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  tokenVersion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// =============================================================================
// MAIN FUNCTION
// =============================================================================

async function createAdmin() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  PRODUCTION ADMIN CREATION');
  console.log('═══════════════════════════════════════════════════════════════');

  // Get admin details from environment variables
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;

  // Check if all required variables are provided
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD) {
    console.error('\n❌ Missing required environment variables!\n');
    console.log('Required variables:');
    console.log(`   ADMIN_NAME     ${ADMIN_NAME ? '✅' : '❌ (missing)'}`);
    console.log(`   ADMIN_EMAIL    ${ADMIN_EMAIL ? '✅' : '❌ (missing)'}`);
    console.log(`   ADMIN_PHONE    ${ADMIN_PHONE ? '✅' : '❌ (missing)'}`);
    console.log(`   ADMIN_PASSWORD ${ADMIN_PASSWORD ? '✅' : '❌ (missing)'}`);
    console.log('\nUsage:');
    console.log('   NODE_ENV=production \\');
    console.log('   ADMIN_NAME="John Doe" \\');
    console.log('   ADMIN_EMAIL="admin@example.com" \\');
    console.log('   ADMIN_PHONE="0771234567" \\');
    console.log('   ADMIN_PASSWORD="SecurePass123!" \\');
    console.log('   node scripts/createProdAdmin.js');
    console.log('\nPassword Requirements:');
    console.log('   • Minimum 12 characters');
    console.log('   • At least 1 uppercase letter (A-Z)');
    console.log('   • At least 1 lowercase letter (a-z)');
    console.log('   • At least 1 number (0-9)');
    console.log('   • At least 1 symbol (!@#$%^&* etc.)');
    process.exit(1);
  }

  // Validate using existing Zod schema (reuse, don't reinvent)
  console.log('\n🔍 Validating input using registerSchema...');
  const result = registerSchema.safeParse({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    phone: ADMIN_PHONE,
    password: ADMIN_PASSWORD
  });

  if (!result.success) {
    console.error('\n❌ Validation failed:\n');
    result.error.errors.forEach(err => console.log(`   • ${err.message}`));
    console.log('\nPassword Requirements:');
    console.log('   • Minimum 12 characters');
    console.log('   • At least 1 uppercase letter (A-Z)');
    console.log('   • At least 1 lowercase letter (a-z)');
    console.log('   • At least 1 number (0-9)');
    console.log('   • At least 1 symbol (!@#$%^&* etc.)');
    process.exit(1);
  }

  // Use sanitized/transformed data from Zod
  const validatedData = result.data;

  console.log('✅ Input validation passed');
  console.log(`   Name:  ${validatedData.name}`);
  console.log(`   Email: ${validatedData.email}`);
  console.log(`   Phone: ${validatedData.phone}`);

  // Determine database URI based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = isProduction
    ? (process.env.MONGODB_URI_PROD || process.env.MONGODB_URI)
    : (process.env.MONGODB_URI_DEV || process.env.MONGODB_URI);

  if (!uri) {
    const envVar = isProduction ? 'MONGODB_URI_PROD' : 'MONGODB_URI_DEV';
    console.error(`\n❌ ${envVar} (or MONGODB_URI) is not set in .env file`);
    process.exit(1);
  }

  console.log(`\n📦 Connecting to ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} database...`);

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to database');

    const Admin = mongoose.model('Admin', adminSchema);

    // Check if admin already exists (by email)
    const existingByEmail = await Admin.findOne({ email: validatedData.email });
    if (existingByEmail) {
      console.log(`\n⚠️  Admin with email "${validatedData.email}" already exists`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Check if admin already exists (by phone)
    const existingByPhone = await Admin.findOne({ phone: validatedData.phone });
    if (existingByPhone) {
      console.log(`\n⚠️  Admin with phone "${validatedData.phone}" already exists`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    console.log('\n🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create admin
    console.log('📝 Creating admin...');
    const admin = await Admin.create({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      password: hashedPassword
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ ADMIN CREATED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   ID:    ${admin._id}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Phone: ${admin.phone}`);
    console.log(`   Role:  ${admin.role}`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Store your password securely. It cannot be recovered.');

  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue || {})[0];
      console.error(`\n❌ Admin with this ${field} already exists`);
    } else {
      console.error('\n❌ Failed to create admin:', error.message);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n📦 Database connection closed');
  }
}

// =============================================================================
// RUN
// =============================================================================

createAdmin().catch(err => {
  console.error('Script crashed:', err);
  process.exit(1);
});
