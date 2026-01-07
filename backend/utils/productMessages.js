export const PRODUCT_MESSAGES = {
    // Validation
    TITLE_REQUIRED: 'Product title is required',
    TITLE_LENGTH: 'Title must be between 3 and 100 characters',
    DESCRIPTION_REQUIRED: 'Product description is required',
    DESCRIPTION_LENGTH: 'Description must be between 10 and 1000 characters',
    STOCK_REQUIRED: 'Product stock is required',
    STOCK_NUMERIC: 'Stock must be a non-negative number',
    PRICE_REQUIRED: 'Price is required',
    PRICE_NUMERIC: 'Price must be a non-negative number',
    CATEGORY_REQUIRED: 'Product category is required',
    CATEGORY_INVALID: 'Invalid category. Must be one of: {categories}',
    IMAGE_REQUIRED: 'Product image is required',
    ALL_FIELDS_REQUIRED: 'All fields (title, description, stock, category, price) are required',

    // Errors
    PRODUCT_NOT_FOUND: 'Product not found',
    CREATE_FAILED: 'Error creating product',
    UPDATE_FAILED: 'Error updating product',
    DELETE_FAILED: 'Error deleting product',
    DUPLICATE_PRODUCT: 'A product with the same title and category already exists',

    // Success
    CREATE_SUCCESS: 'Product created successfully',
    UPDATE_SUCCESS: 'Product updated successfully',
    DELETE_SUCCESS: 'Product deleted successfully',
    FETCH_SUCCESS: 'Products retrieved successfully'
};

// Helper function to format messages with placeholders
export const formatProductMessage = (message, placeholders = {}) => {
    let formattedMessage = message;

    Object.keys(placeholders).forEach(key => {
        const placeholder = `{${key}}`;
        formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), placeholders[key]);
    });

    return formattedMessage;
};
