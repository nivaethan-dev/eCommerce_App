import { CommandFactory } from './CommandFactory.js';
import { CustomerSeeder } from './CustomerSeeder.js';
import { AdminSeeder } from './AdminSeeder.js';
import { BaseSeeder } from './BaseSeeder.js';

// Simple command classes
class CustomerCommand {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  async execute() {
    const seeder = new CustomerSeeder(this.options);
    await seeder.run();
  }
}

class AdminCommand {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  async execute() {
    const seeder = new AdminSeeder(this.options);
    await seeder.run();
  }
}

class AllCommand {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  async execute() {
    console.log('🌱 Starting All Seeders...');
    console.log('📊 Will run 2 seeders');
    
    const adminSeeder = new AdminSeeder(this.options.admin || {});
    await adminSeeder.run();
    
    console.log('\n--- Running Customer Seeder ---');
    const customerSeeder = new CustomerSeeder(this.options.customers || {});
    await customerSeeder.run();
    
    console.log('\n🎉 All seeders completed successfully!');
  }
}

class ResetCommand {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  async execute() {
    try {
      // Step 1: Validate environment
      if (process.env.NODE_ENV !== 'development') {
        console.error('⛔ Reset is only allowed in development environment');
        process.exit(1);
      }

      // Step 2: Connect to database
      const mongoose = (await import('mongoose')).default;
      const dotenv = (await import('dotenv')).default;
      dotenv.config();
      
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('📦 Connected to MongoDB');

      // Step 3: Clear all data
      console.log('🔄 Starting database reset...');
      await BaseSeeder.clearAllModels();

      // Step 4: Reseed all data
      console.log('\n🌱 Reseeding all data...');
      const adminSeeder = new AdminSeeder(this.options.admin || {});
      await adminSeeder.run();
      
      console.log('\n--- Reseeding Customers ---');
      const customerSeeder = new CustomerSeeder(this.options.customers || {});
      await customerSeeder.run();
      
      console.log('\n🎉 Database reset completed successfully!');
      console.log('📊 Fresh data has been seeded');

    } catch (error) {
      console.error('❌ Reset command failed:', error);
      throw error;
    } finally {
      // Always disconnect
      const mongoose = (await import('mongoose')).default;
      await mongoose.connection.close();
      console.log('📦 Database connection closed');
    }
  }
}

class ClearAllCommand {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  async execute() {
    try {
      // Step 1: Validate environment
      if (process.env.NODE_ENV !== 'development') {
        console.error('⛔ Clear is only allowed in development environment');
        process.exit(1);
      }

      // Step 2: Connect to database
      const mongoose = (await import('mongoose')).default;
      const dotenv = (await import('dotenv')).default;
      dotenv.config();
      
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('📦 Connected to MongoDB');

      // Step 3: Clear all data
      console.log('🧹 Starting database clear...');
      const totalCleared = await BaseSeeder.clearAllModels();
      
      console.log(`\n✅ Database clear completed successfully!`);
      console.log(`📊 Cleared ${totalCleared} records total`);

    } catch (error) {
      console.error('❌ Clear command failed:', error);
      throw error;
    } finally {
      // Always disconnect
      const mongoose = (await import('mongoose')).default;
      await mongoose.connection.close();
      console.log('📦 Database connection closed');
    }
  }
}

class ClearModelCommand {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  async execute() {
    try {
      // Step 1: Validate environment
      if (process.env.NODE_ENV !== 'development') {
        console.error('⛔ Clear is only allowed in development environment');
        process.exit(1);
      }

      // Step 2: Get model name from options
      const modelName = this.options.model;
      if (!modelName) {
        console.error('❌ Model name is required for clear:model command');
        console.log('Usage: npm run seed:clear:model -- --model=customers');
        process.exit(1);
      }

      // Step 3: Connect to database
      const mongoose = (await import('mongoose')).default;
      const dotenv = (await import('dotenv')).default;
      dotenv.config();
      
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('📦 Connected to MongoDB');

      // Step 4: Clear specific model data
      const clearedCount = await BaseSeeder.clearSpecificModel(modelName);
      
      console.log(`\n✅ ${modelName} clear completed successfully!`);
      console.log(`📊 Cleared ${clearedCount} ${modelName} records`);

    } catch (error) {
      console.error('❌ Clear model command failed:', error);
      throw error;
    } finally {
      // Always disconnect
      const mongoose = (await import('mongoose')).default;
      await mongoose.connection.close();
      console.log('📦 Database connection closed');
    }
  }
}

// Register commands
CommandFactory.registerCommand('customers', CustomerCommand);
CommandFactory.registerCommand('admin', AdminCommand);
CommandFactory.registerCommand('all', AllCommand);
CommandFactory.registerCommand('reset', ResetCommand);
CommandFactory.registerCommand('clear', ClearAllCommand);
CommandFactory.registerCommand('clear:model', ClearModelCommand);

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'all';

// Parse options from command line arguments
const options = {};
for (let i = 1; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const [key, value] = args[i].substring(2).split('=');
    options[key] = value;
  }
}

// Run the appropriate command
async function runCommand() {
  try {
    if (!CommandFactory.hasCommand(command)) {
      console.error(`❌ Unknown command: ${command}`);
      console.log(`Available commands: ${CommandFactory.getAvailableCommands().join(', ')}`);
      process.exit(1);
    }

    const commandInstance = CommandFactory.createCommand(command, options);
    await commandInstance.execute();
    
  } catch (error) {
    console.error('❌ Command execution failed:', error);
    process.exit(1);
  }
}

// Run the command
runCommand();
