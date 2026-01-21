/**
 * Production-Safe Error Handling Utilities
 * 
 * Prevents leakage of sensitive information in error responses:
 * - Stack traces
 * - File paths
 * - MongoDB query details
 * - Internal schema information
 */

/**
 * Custom application error for user-facing messages
 * These errors are safe to show to users in any environment
 */
export class AppError extends Error {
  constructor(message, statusCode = 400, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Distinguishes operational errors from programming errors
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace (for logging, not for client)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * HTTP Status codes for common error types
 */
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Generic safe messages for production
 */
const SAFE_MESSAGES = {
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  CAST_ERROR: 'Invalid ID format.',
  DUPLICATE_ERROR: 'Resource already exists.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'Access denied.',
  TOKEN_EXPIRED: 'Session expired. Please login again.',
  TOKEN_INVALID: 'Invalid token. Please login again.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  RATE_LIMIT: 'Too many requests. Please try again later.'
};

/**
 * Checks if the current environment is production
 */
export const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Determines if an error is operational (expected) or a programming error
 * Operational errors are safe to show to users
 */
export const isOperationalError = (error) => {
  // Custom AppError is always operational
  if (error instanceof AppError) {
    return error.isOperational;
  }
  
  // Mongoose validation errors are operational
  if (error.name === 'ValidationError') {
    return true;
  }
  
  // Mongoose cast errors (invalid ObjectId) are operational
  if (error.name === 'CastError') {
    return true;
  }
  
  // MongoDB duplicate key errors are operational
  if (error.code === 11000) {
    return true;
  }
  
  // JWT errors are operational
  if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
    return true;
  }
  
  // Default: not operational (programming error)
  return false;
};

/**
 * Gets the appropriate HTTP status code for an error
 */
export const getErrorStatusCode = (error) => {
  // Custom AppError has its own status
  if (error instanceof AppError) {
    return error.statusCode;
  }
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return HTTP_STATUS.BAD_REQUEST;
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return HTTP_STATUS.BAD_REQUEST;
  }
  
  // MongoDB duplicate key error
  if (error.code === 11000) {
    return HTTP_STATUS.CONFLICT;
  }
  
  // JWT Token expired
  if (error.name === 'TokenExpiredError') {
    return HTTP_STATUS.UNAUTHORIZED;
  }
  
  // JWT Invalid token
  if (error.name === 'JsonWebTokenError') {
    return HTTP_STATUS.UNAUTHORIZED;
  }
  
  // Default to internal server error
  return HTTP_STATUS.INTERNAL_ERROR;
};

/**
 * Returns a safe error message based on error type and environment
 * In production: returns generic messages to hide sensitive details
 * In development: returns detailed messages for debugging
 */
export const getSafeErrorMessage = (error) => {
  const isProd = isProduction();
  
  // Custom AppError - always safe to show
  if (error instanceof AppError) {
    return error.message;
  }
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    if (isProd) {
      return SAFE_MESSAGES.VALIDATION_ERROR;
    }
    // In dev, show field-level errors
    const messages = Object.values(error.errors || {}).map(e => e.message);
    return messages.length > 0 ? messages.join(', ') : error.message;
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    if (isProd) {
      return SAFE_MESSAGES.CAST_ERROR;
    }
    return `Invalid ${error.path}: ${error.value}`;
  }
  
  // MongoDB duplicate key error
  if (error.code === 11000) {
    if (isProd) {
      return SAFE_MESSAGES.DUPLICATE_ERROR;
    }
    // In dev, show which field caused the duplicate
    const field = Object.keys(error.keyValue || {})[0];
    return field ? `Duplicate value for field: ${field}` : 'Duplicate key error';
  }
  
  // JWT Token expired
  if (error.name === 'TokenExpiredError') {
    return SAFE_MESSAGES.TOKEN_EXPIRED;
  }
  
  // JWT Invalid token
  if (error.name === 'JsonWebTokenError') {
    if (isProd) {
      return SAFE_MESSAGES.TOKEN_INVALID;
    }
    return `Token error: ${error.message}`;
  }
  
  // For all other errors in production, return generic message
  if (isProd) {
    return SAFE_MESSAGES.INTERNAL_ERROR;
  }
  
  // In development, return the actual error message
  return error.message || SAFE_MESSAGES.INTERNAL_ERROR;
};

/**
 * Formats error response object based on environment
 * Includes stack trace only in development
 */
export const formatErrorResponse = (error) => {
  const isProd = isProduction();
  const statusCode = getErrorStatusCode(error);
  const message = getSafeErrorMessage(error);
  
  const response = {
    success: false,
    error: message
  };
  
  // In development, include additional debugging info
  if (!isProd) {
    response.errorType = error.name || 'Error';
    if (error.stack) {
      response.stack = error.stack;
    }
    if (error.code) {
      response.code = error.code;
    }
  }
  
  return { statusCode, response };
};

/**
 * Checks if an error message is safe to expose to clients
 * Used for known application-specific error messages
 */
export const isSafeMessage = (message, safeMessages = []) => {
  return safeMessages.some(safeMsg => 
    message === safeMsg || message.startsWith(safeMsg.split(':')[0])
  );
};

/**
 * Sanitizes error for logging (removes sensitive data but keeps useful info)
 */
export const sanitizeErrorForLogging = (error, req = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    name: error.name,
    message: error.message,
    statusCode: getErrorStatusCode(error),
    isOperational: isOperationalError(error)
  };
  
  // Add request context if available
  if (req) {
    logEntry.method = req.method;
    logEntry.path = req.path;
    logEntry.ip = req.ip;
    // Don't log sensitive headers like Authorization
    logEntry.userAgent = req.get('user-agent');
  }
  
  // Add stack trace for non-operational errors
  if (!logEntry.isOperational && error.stack) {
    logEntry.stack = error.stack;
  }
  
  return logEntry;
};

export default {
  AppError,
  HTTP_STATUS,
  isProduction,
  isOperationalError,
  getErrorStatusCode,
  getSafeErrorMessage,
  formatErrorResponse,
  isSafeMessage,
  sanitizeErrorForLogging
};

