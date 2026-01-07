// Centralized message constants for order operations
// This ensures consistency across the application and makes messages easily maintainable

export const ORDER_MESSAGES = {
  // Validation messages
  ORDER_ID_REQUIRED: 'Order ID is required',
  STATUS_REQUIRED: 'Status is required',
  LIMIT_INVALID: 'Limit must be between 1 and 100',
  SKIP_INVALID: 'Skip must be a non-negative number',
  STATUS_INVALID: 'Invalid status. Must be one of: {statuses}',

  // Error messages
  CUSTOMER_NOT_FOUND: 'Customer not found',
  ORDER_NOT_FOUND: 'Order not found',
  CART_EMPTY: 'Cannot create order: cart is empty',
  NO_VALID_ITEMS: 'Cannot create order: no valid items in cart',
  INSUFFICIENT_STOCK: 'Insufficient stock for product: {productTitle}. Available: {stock}, Requested: {quantity}',

  // Success messages
  ORDER_PLACED: 'Order placed successfully',
  ORDERS_RETRIEVED: 'Orders retrieved successfully',
  ORDER_STATUS_UPDATED: 'Order status updated successfully',

  // Generic error messages
  PLACE_ORDER_FAILED: 'Failed to place order',
  GET_ORDERS_FAILED: 'Failed to retrieve orders',
  UPDATE_ORDER_STATUS_FAILED: 'Failed to update order status',
  GET_ORDER_FAILED: 'Failed to retrieve order'
};

// Helper function to format messages with placeholders
export const formatOrderMessage = (message, placeholders = {}) => {
  let formattedMessage = message;

  Object.keys(placeholders).forEach(key => {
    const placeholder = `{${key}}`;
    formattedMessage = formattedMessage.replace(new RegExp(placeholder, 'g'), placeholders[key]);
  });

  return formattedMessage;
};

// Valid order statuses
export const VALID_ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

// Default order status
export const DEFAULT_ORDER_STATUS = 'Pending';

