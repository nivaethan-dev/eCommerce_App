import { DataGenerator } from './DataGenerator.js';
import { predefinedCustomers } from '../data/customerData.js';
import { adminData } from '../data/adminData.js';

/**
 * Simple data helper functions for creating datasets
 * Follows functional programming principles - no classes, just pure functions
 */

/**
 * Creates a complete customer dataset by combining predefined and generated customers
 * @param {Object} options - Configuration options
 * @param {number} options.generatedCount - Number of generated customers to add
 * @param {Object} options.generationOptions - Options for data generation
 * @returns {Array} Complete customer dataset
 */
export const createCustomerDataset = (options = {}) => {
  const {
    generatedCount = 6,
    generationOptions = {
      // 80% verified accounts by default
      isAccountVerified: Math.random() > 0.2
    }
  } = options;

  const generatedCustomers = DataGenerator.generateCustomers(generatedCount, generationOptions);
  
  return [...predefinedCustomers, ...generatedCustomers];
};

/**
 * Creates a complete admin dataset
 * @param {Object} options - Configuration options (currently unused but kept for consistency)
 * @returns {Array} Complete admin dataset
 */
export const createAdminDataset = (options = {}) => {
  return [...adminData];
};


