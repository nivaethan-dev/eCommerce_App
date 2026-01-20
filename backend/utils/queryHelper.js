import { escapeRegex } from '../validation/sanitizers.js';

export const fetchDocuments = async (model, filters = {}, options = {}) => {
    const { role, userId, ownerField, selectFields } = options;
  
    // Role-based filtering
    if (role === 'customer' && ownerField) {
      // customer can only access their own documents
      filters[ownerField] = userId;
    }
    // For public role, no additional filtering needed - show all products
  
    // Build search query for text fields
    const searchQuery = {};
    if (filters.search && filters.searchFields) {
      // Escape regex special characters to prevent ReDoS attacks
      const safeSearch = escapeRegex(filters.search);
      searchQuery['$or'] = filters.searchFields.map(field => ({
        [field]: { $regex: safeSearch, $options: 'i' }
      }));
    }
  
    // Merge searchQuery with other filters
    const finalQuery = { ...filters.query, ...searchQuery };
  
    // Pagination 
    const limit = parseInt(filters.limit) || 20;
    const page = parseInt(filters.page) || 1;
    const skip = (page - 1) * limit;
  
    // Build query with optional field selection
    let query = model.find(finalQuery).skip(skip).limit(limit);
    
    // Apply field selection if specified
    if (selectFields) {
      query = query.select(selectFields);
    }
  
    return await query;
};
  
/**
 * Fetch documents with pagination metadata (for server-side pagination UIs).
 * Does NOT change `fetchDocuments` behavior to avoid breaking existing callers.
 */
export const fetchDocumentsPaged = async (model, filters = {}, options = {}) => {
  const { role, userId, ownerField, selectFields, sort } = options;

  // Role-based filtering
  const roleFilter = {};
  if (role === 'customer' && ownerField) {
    roleFilter[ownerField] = userId;
  }

  // Build search query for text fields
  const searchQuery = {};
  if (filters.search && filters.searchFields) {
    // Escape regex special characters to prevent ReDoS attacks
    const safeSearch = escapeRegex(filters.search);
    searchQuery['$or'] = filters.searchFields.map((field) => ({
      [field]: { $regex: safeSearch, $options: 'i' }
    }));
  }

  const finalQuery = { ...filters.query, ...roleFilter, ...searchQuery };

  const limit = Math.max(1, parseInt(filters.limit, 10) || 20);
  const page = Math.max(1, parseInt(filters.page, 10) || 1);
  const skip = (page - 1) * limit;

  const total = await model.countDocuments(finalQuery);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  let query = model
    .find(finalQuery)
    .sort(sort || { createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit);

  if (selectFields) {
    query = query.select(selectFields);
  }

  const docs = await query;
  return { docs, page, limit, total, totalPages };
};
  