import rateLimit from 'express-rate-limit';
import { normalizeEmail } from '../validation/sanitizers.js';
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
 * Generate key based on IP + email
 * Used for specific account-targeted protection
 */
const ipPlusEmailKey = (req) => {
    const rawEmail = req.body?.email || 'unknown';
    const email = normalizeEmail(rawEmail);
    return `${req.ip}:${email}`;
};

/**
 * Generate key based on IP + user ID for authenticated endpoints
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
 * CRITICAL FIX: Changed to IP-based only to prevent an attacker from trying 
 * thousands of accounts from a single IP. This implements the "IP Block" 
 * behavior requested by the user.
 * 
 * Account-side protection is still handled by the database lockout logic.
 */
export const loginLimiter = rateLimit({
    windowMs: LOGIN_LOCK_TIME,
    max: LOGIN_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Too many login attempts from this IP. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Only count failed login attempts
    keyGenerator: (req) => req.ip, // STRICT IP BLOCKING
});

/**
 * Registration rate limiter
 * Limits registration attempts per IP to prevent spam/bot registrations
 */
export const registerLimiter = rateLimit({
    windowMs: REGISTER_LOCK_TIME,
    max: REGISTER_MAX_ATTEMPTS,
    message: {
        success: false,
        error: 'Registration limit reached. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.ip, // STRICT IP BLOCKING
});

/**
 * Refresh token rate limiter
 * Prevents token refresh abuse
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