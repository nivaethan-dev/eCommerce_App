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
      searchQuery['$or'] = filters.searchFields.map(field => ({
        [field]: { $regex: filters.search, $options: 'i' }
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
  