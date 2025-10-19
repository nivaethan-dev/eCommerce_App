import { BaseSeeder } from './BaseSeeder.js';
import Admin from '../../models/Admin.js';
import { createAdminDataset } from './utils/dataHelpers.js';
import { hashPassword } from '../../utils/securityUtils.js';

/**
 * Admin seeder - extends BaseSeeder with admin-specific logic
 */
export class AdminSeeder extends BaseSeeder {
  constructor(options = {}) {
    const adminData = createAdminDataset(options.dataOptions || {});
    
    super(Admin, adminData, {
      batchSize: 2,
      skipIfExists: true,
      clearExisting: false,
      ...options
    });
  }

  /**
   * Override processData to hash passwords
   */
  async processData() {
    console.log('🔐 Processing admin data (hashing passwords)...');
    
    const processedData = await Promise.all(
      this.data.map(async (admin) => ({
        ...admin,
        password: await hashPassword(admin.password)
      }))
    );

    return processedData;
  }

  /**
   * Override run to add admin-specific logging
   */
  async run() {
    console.log('🚀 Starting Admin Seeder...');
    console.log(`📊 Will seed ${this.data.length} admins`);
    console.log('🔑 All admins will use password: Admin@123FullySecure');
    console.log('⚠️  Remember to change passwords in production!');
    
    await super.run();
  }
}
