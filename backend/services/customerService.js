import Customer from '../models/Customer.js';
import { fetchDocuments } from '../utils/queryHelper.js';

// Exclude sensitive fields in the service
export const getCustomers = async (role, userId, queryParams) => {
  return await fetchDocuments(Customer, {
    search: queryParams.search,
    searchFields: ['name', 'email', 'phone'],
    query: {}
  }, { 
    role, 
    userId, 
    ownerField: '_id',
    selectFields: '-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt'
  });
};
