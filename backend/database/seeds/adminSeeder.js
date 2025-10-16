import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../../models/Admin.js';
import { hashPassword } from '../../utils/securityUtils.js';

// Load environment variables
dotenv.config();

// Development environment check
const isDevelopment = process.env.NODE_ENV === 'development';

// Default admin credentials (only for development)
const defaultAdmin = {
  name: 'Super Admin',
  email: 'admin@example.com',
  phone: '+94773456789',
  password: 'Admin@123FullySecure', // This will be hashed before saving
  role: 'admin'
};

async function seedAdmin() {
  try {
    // Safety check: only run in development
    if (!isDevelopment) {
      console.error('⛔ Admin seeding is only allowed in development environment');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      // Hash the password
      const hashedPassword = await hashPassword(defaultAdmin.password);

      // Create admin with hashed password
      const admin = await Admin.create({
        ...defaultAdmin,
        password: hashedPassword
      });

      console.log('✅ Default admin created successfully');
      console.log('📧 Email:', defaultAdmin.email);
      console.log('🔑 Password:', defaultAdmin.password);
      console.log('⚠️  Please change these credentials immediately after first login');
    } else {
      console.log('ℹ️  Admin already exists, skipping seed');
    }

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
  }
}

// Run the seeder
seedAdmin();
