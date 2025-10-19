import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Base seeder class using Template Method pattern
 * Provides common seeding functionality that can be extended
 */
export class BaseSeeder {
  constructor(model, data, options = {}) {
    this.model = model;
    this.data = data;
    this.options = {
      batchSize: 5,
      clearExisting: false,
      skipIfExists: true,
      ...options
    };
  }

  /**
   * Template method - defines the seeding algorithm structure
   */
  async run() {
    try {
      // Step 1: Validate environment
      this.validateEnvironment();
      
      // Step 2: Connect to database
      await this.connect();
      
      // Step 3: Check existing data
      const hasExisting = await this.checkExistingData();
      if (hasExisting && this.options.skipIfExists) {
        const count = await this.model.countDocuments();
        console.log(`ℹ️  ${this.model.modelName} records already exist, skipping seed`);
        console.log(`📊 Found ${count} existing ${this.model.modelName} records`);
        return;
      }

      // Step 4: Clear existing data if requested
      if (this.options.clearExisting) {
        await this.clearExistingData();
      }

      // Step 5: Process data (can be overridden by subclasses)
      const processedData = await this.processData();

      // Step 6: Seed data in batches
      const createdCount = await this.seedInBatches(processedData);

      console.log(`🎉 ${this.model.modelName} seeding completed successfully!`);
      console.log(`📊 Created ${createdCount} ${this.model.modelName} records`);

    } catch (error) {
      console.error(`❌ Error seeding ${this.model.modelName}:`, error);
      throw error;
    } finally {
      // Step 7: Always disconnect
      await this.disconnect();
    }
  }

  /**
   * Validate environment - only allow development
   */
  validateEnvironment() {
    if (process.env.NODE_ENV !== 'development') {
      console.error('⛔ Seeding is only allowed in development environment');
      process.exit(1);
    }
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('📦 Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('📦 Database connection closed');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
    }
  }

  /**
   * Check if data already exists
   */
  async checkExistingData() {
    if (!this.options.skipIfExists) return false;
    const count = await this.model.countDocuments();
    return count > 0;
  }

  /**
   * Clear existing data
   */
  async clearExistingData() {
    const result = await this.model.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} existing ${this.model.modelName} records`);
  }

  /**
   * Clear all data for this model (used by reset/clear commands)
   */
  async clearAllData() {
    const result = await this.model.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} ${this.model.modelName} records`);
    return result.deletedCount;
  }

  /**
   * Process data before seeding - can be overridden by subclasses
   */
  async processData() {
    return this.data;
  }

  /**
   * Seed data in batches
   */
  async seedInBatches(data) {
    let createdCount = 0;
    const totalCount = data.length;

    console.log(`🌱 Starting ${this.model.modelName} seeding...`);

    for (let i = 0; i < data.length; i += this.options.batchSize) {
      const batch = data.slice(i, i + this.options.batchSize);
      
      try {
        await this.model.insertMany(batch);
        createdCount += batch.length;
        console.log(`✅ Created ${createdCount}/${totalCount} ${this.model.modelName} records`);
      } catch (error) {
        if (error.code === 11000) {
          console.warn(`⚠️  Some ${this.model.modelName} records already exist, skipping duplicates`);
        } else {
          throw error;
        }
      }
    }

    return createdCount;
  }

  /**
   * Static method to clear all data from all models
   * Used by reset and clear commands
   */
  static async clearAllModels() {
    try {
      // Import models dynamically to avoid circular dependencies
      const Customer = (await import('../../models/Customer.js')).default;
      const Admin = (await import('../../models/Admin.js')).default;
      const Product = (await import('../../models/Product.js')).default;
      const Order = (await import('../../models/Order.js')).default;

      const models = [Customer, Admin, Product, Order];
      let totalCleared = 0;

      console.log('🧹 Clearing all data from database...');
      
      for (const model of models) {
        try {
          const result = await model.deleteMany({});
          totalCleared += result.deletedCount;
          console.log(`🗑️  Cleared ${result.deletedCount} ${model.modelName} records`);
        } catch (error) {
          console.warn(`⚠️  Could not clear ${model.modelName}: ${error.message}`);
        }
      }

      console.log(`✅ Total cleared: ${totalCleared} records across all models`);
      return totalCleared;
    } catch (error) {
      console.error('❌ Error clearing all models:', error);
      throw error;
    }
  }

  /**
   * Static method to clear data from a specific model
   * Used by clear:model commands
   */
  static async clearSpecificModel(modelName) {
    try {
      let Model;
      let modelDisplayName;

      // Import the specific model
      switch (modelName.toLowerCase()) {
        case 'customers':
        case 'customer':
          Model = (await import('../../models/Customer.js')).default;
          modelDisplayName = 'Customer';
          break;
        case 'admins':
        case 'admin':
          Model = (await import('../../models/Admin.js')).default;
          modelDisplayName = 'Admin';
          break;
        case 'products':
        case 'product':
          Model = (await import('../../models/Product.js')).default;
          modelDisplayName = 'Product';
          break;
        case 'orders':
        case 'order':
          Model = (await import('../../models/Order.js')).default;
          modelDisplayName = 'Order';
          break;
        default:
          throw new Error(`Unknown model: ${modelName}`);
      }

      console.log(`🧹 Clearing ${modelDisplayName} data...`);
      const result = await Model.deleteMany({});
      console.log(`🗑️  Cleared ${result.deletedCount} ${modelDisplayName} records`);
      
      return result.deletedCount;
    } catch (error) {
      console.error(`❌ Error clearing ${modelName}:`, error);
      throw error;
    }
  }
}
