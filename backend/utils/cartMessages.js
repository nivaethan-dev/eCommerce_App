// Centralized message constants for cart operations
// This ensures consistency across the application and makes messages easily maintainable

export const CART_MESSAGES = {
  // Validation messages
  PRODUCT_ID_REQUIRED: 'Product ID is required',
  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_MINIMUM: 'Quantity must be at least 1',
  QUANTITY_NON_NEGATIVE: 'Quantity cannot be negative',
  
  // Error messages
  CUSTOMER_NOT_FOUND: 'Customer not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_NOT_IN_CART: 'Product not found in cart',
  PRODUCT_OUT_OF_STOCK: 'Product is out of stock',
  INSUFFICIENT_STOCK: 'Only {stock} items available in stock. You already have {cartQuantity} in your cart.',
  
  // Success messages
  ITEM_ADDED: 'Product added to cart successfully',
  ITEM_UPDATED: 'Cart quantity updated successfully',
  ITEM_REMOVED: 'Product removed from cart successfully',
  CART_RETRIEVED: 'Cart retrieved successfully',
  
  // Generic error messages
  ADD_TO_CART_FAILED: 'Failed to add product to cart',
  UPDATE_CART_FAILED: 'Failed to update cart item',
  REMOVE_FROM_CART_FAILED: 'Failed to remove product from cart',
  GET_CART_FAILED: 'Failed to retrieve cart'
};

// Helper function to format messages with placeholders
export const formatMessage = (message, placeholders = {}) => {
  let formattedMessage = message;
  
  Object.keys(placeholders).forEach(key => {
    const placeholder = `{${key}}`;
    formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), placeholders[key]);
  });
  
  return formattedMessage;
};

// Helper function to get stock error message
export const getStockErrorMessage = (currentStock, cartQuantity) => {
  return formatMessage(CART_MESSAGES.INSUFFICIENT_STOCK, {
    stock: currentStock,
    cartQuantity: cartQuantity
  });
};
