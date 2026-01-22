import rateLimit from 'express-rate-limit';
import {
    LOGIN_MAX_ATTEMPTS,
    LOGIN_LOCK_TIME,
    REGISTER_MAX_ATTEMPTS,
    REGISTER_LOCK_TIME,
    REFRESH_TOKEN_MAX_ATTEMPTS,
    REFRESH_TOKEN_WINDOW,
    ORDER_MAX_ATTEMPTS,
    ORDER_WINDOW,
    CART_MAX_ATTEMPTS,
    CART_WINDOW,
    CART_MODIFY_MAX_ATTEMPTS,
    CART_MODIFY_WINDOW,
    PRODUCT_SEARCH_MAX_ATTEMPTS,
    PRODUCT_SEARCH_WINDOW,
    PRODUCT_CREATE_MAX_ATTEMPTS,
    PRODUCT_CREATE_WINDOW,
    PRODUCT_MODIFY_MAX_ATTEMPTS,
    PRODUCT_MODIFY_WINDOW,
    PRODUCT_READ_MAX_ATTEMPTS,
    PRODUCT_READ_WINDOW,
    ADMIN_READ_MAX_ATTEMPTS,
    ADMIN_READ_WINDOW,
    NOTIFICATION_MAX_ATTEMPTS,
    NOTIFICATION_WINDOW
} from '../config/rateLimitConfig.js';

// =============================================================================
// CUSTOM KEY GENERATORS FOR ENHANCED SECURITY
// =============================================================================

/**
 * Generate key based on IP + email for authentication endpoints
 * Prevents attackers from bypassing rate limits via IP rotation
 * Security: Protects against distributed brute-force attacks
 */
const ipPlusEmailKey = (req) => {
    const email = req.body?.email || 'unknown';
    return `${req.ip}:${email}`;
};

/**
 * Generate key based on IP + user ID for authenticated endpoints
 * Useful for user-specific rate limiting
 */
const ipPlusUserKey = (req) => {
    const userId = req.user?.id || 'anonymous';
    return `${req.ip}:${userId}`;
};

// =============================================================================
// AUTHENTICATION RATE LIMITERS
// =============================================================================

/**
 * Login rate limiter
 * Uses IP + email combination to prevent distributed brute-force attacks
 * Attackers cannot bypass by rotating IPs for the same email
 */
export const loginLimiter = rateLimit({
    windowMs: LOGIN_LOCK_TIME,
    max: LOGIN_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many login attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Only count failed login attempts
    keyGenerator: ipPlusEmailKey, // IP + email for better security
    validate: { keyGeneratorIpFallback: false }, // Suppress IPv6 validation warning for custom key
});

/**
 * Registration rate limiter
 * Limits registration attempts per IP + email
 */
export const registerLimiter = rateLimit({
    windowMs: REGISTER_LOCK_TIME,
    max: REGISTER_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Maximum registration limit reached. Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Count all attempts
    keyGenerator: ipPlusEmailKey, // IP + email for better security
    validate: { keyGeneratorIpFallback: false }, // Suppress IPv6 validation warning for custom key
});

/**
 * Refresh token rate limiter
 * Prevents token refresh abuse
 * Uses IP + user combination since this is authenticated
 */
export const refreshTokenLimiter = rateLimit({
    windowMs: REFRESH_TOKEN_WINDOW,
    max: REFRESH_TOKEN_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many refresh requests. Please try again in a moment'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    // IP-based is fine here since authenticated users are already validated
});

// =============================================================================
// SHOPPING & ORDER RATE LIMITERS
// =============================================================================

/**
 * Order rate limiter - prevents order flooding
 */
export const orderLimiter = rateLimit({
    windowMs: ORDER_WINDOW,
    max: ORDER_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Order limit reached. Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Cart rate limiter - prevents cart bombing
 */
export const cartLimiter = rateLimit({
    windowMs: CART_WINDOW,
    max: CART_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many cart requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Cart modify rate limiter - update/delete cart items
 */
export const cartModifyLimiter = rateLimit({
    windowMs: CART_MODIFY_WINDOW,
    max: CART_MODIFY_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many cart modifications. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

// =============================================================================
// PRODUCT RATE LIMITERS
// =============================================================================

/**
 * Search/product listing rate limiter - prevents scraping
 */
export const searchLimiter = rateLimit({
    windowMs: PRODUCT_SEARCH_WINDOW,
    max: PRODUCT_SEARCH_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many requests. Please try again in a moment'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Product create rate limiter - prevents bulk creation
 */
export const productCreateLimiter = rateLimit({
    windowMs: PRODUCT_CREATE_WINDOW,
    max: PRODUCT_CREATE_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Product creation limit reached. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Product modify rate limiter - prevents mass update/delete
 */
export const productModifyLimiter = rateLimit({
    windowMs: PRODUCT_MODIFY_WINDOW,
    max: PRODUCT_MODIFY_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many product modifications. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Product read rate limiter - single product fetch, categories
 */
export const productReadLimiter = rateLimit({
    windowMs: PRODUCT_READ_WINDOW,
    max: PRODUCT_READ_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many product requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

// =============================================================================
// ADMIN RATE LIMITERS
// =============================================================================

/**
 * Admin read rate limiter - list customers, orders, audit logs
 */
export const adminReadLimiter = rateLimit({
    windowMs: ADMIN_READ_WINDOW,
    max: ADMIN_READ_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

// =============================================================================
// NOTIFICATION RATE LIMITERS
// =============================================================================

/**
 * Notification rate limiter - all notification operations
 */
export const notificationLimiter = rateLimit({
    windowMs: NOTIFICATION_WINDOW,
    max: NOTIFICATION_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many notification requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});