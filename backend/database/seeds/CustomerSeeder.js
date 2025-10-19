import { BaseSeeder } from './BaseSeeder.js';
import Customer from '../../models/Customer.js';
import { createCustomerDataset } from './utils/dataHelpers.js';
import { hashPassword } from '../../utils/securityUtils.js';

/**
 * Customer seeder - extends BaseSeeder with customer-specific logic
 */
export class CustomerSeeder extends BaseSeeder {
  constructor(options = {}) {
    const customerData = createCustomerDataset(options.dataOptions || {});
    
    super(Customer, customerData, {
      batchSize: 5,
      skipIfExists: true,
      clearExisting: false,
      ...options
    });
  }

  /**
   * Override processData to hash passwords
   */
  async processData() {
    console.log('🔐 Processing customer data (hashing passwords)...');
    
    const processedData = await Promise.all(
      this.data.map(async (customer) => ({
        ...customer,
        password: await hashPassword(customer.password)
      }))
    );

    return processedData;
  }

  /**
   * Override run to add customer-specific logging
   */
  async run() {
    console.log('🚀 Starting Customer Seeder...');
    console.log(`📊 Will seed ${this.data.length} customers`);
    console.log('🔑 All customers will use password: SuperStringPass123!');
    console.log('⚠️  Remember to change passwords in production!');
    
    await super.run();
  }
}
