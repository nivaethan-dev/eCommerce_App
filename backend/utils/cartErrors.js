// Custom error classes for cart operations
export class CartError extends Error {
  constructor(message, statusCode = 400, isUserError = true) {
    super(message);
    this.name = 'CartError';
    this.statusCode = statusCode;
    this.isUserError = isUserError;
    this.timestamp = new Date().toISOString();
  }
}

export class StockError extends CartError {
  constructor(message, currentStock = 0, requestedQuantity = 0) {
    super(message, 400, true);
    this.name = 'StockError';
    this.currentStock = currentStock;
    this.requestedQuantity = requestedQuantity;
  }
}

export class ProductError extends CartError {
  constructor(message, productId = null) {
    super(message, 404, true);
    this.name = 'ProductError';
    this.productId = productId;
  }
}

export class CartItemError extends CartError {
  constructor(message, productId = null) {
    super(message, 404, true);
    this.name = 'CartItemError';
    this.productId = productId;
  }
}

export class ValidationError extends CartError {
  constructor(message, field = null) {
    super(message, 400, true);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class DatabaseError extends CartError {
  constructor(message, originalError = null) {
    super(message, 500, false);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

// Helper function to determine if error is user-facing
export const isUserError = (error) => {
  return error instanceof CartError && error.isUserError;
};

// Helper function to get appropriate status code
export const getErrorStatusCode = (error) => {
  if (error instanceof CartError) {
    return error.statusCode;
  }
  return 500; // Default server error
};
