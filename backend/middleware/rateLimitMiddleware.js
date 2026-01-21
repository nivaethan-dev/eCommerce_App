import rateLimit from 'express-rate-limit';

// Login rate limiter
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window (PRODUCTION)
    // max: 100, // TEMPORARY - Uncomment for testing to allow 100 attempts
    message: {
        success: false,
        error: 'Too many login attempts. Please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: true, // Only count failed attempts (don't penalize successful logins)
    // Trust the first proxy (Render, Heroku, Nginx, etc.)
    // This reads the leftmost IP from X-Forwarded-For header
    validate: { trustProxy: false } // Disable the validation error
});

// Registration rate limiter
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 total registration attempts per hour
    message: {
        success: false,
        error: 'Maximum registration limit reached. Please try again after 1 hour'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count ALL attempts, including successful ones
    validate: { trustProxy: false } // Disable the validation error
});

// Refresh token rate limiter
export const refreshTokenLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: {
        success: false,
        error: 'Too many refresh requests. Please try again in a moment'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count all attempts
    validate: { trustProxy: false } // Disable the validation error
});

// Order rate limiter - prevents order flooding
export const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 orders per hour (strict)
    message: {
        success: false,
        error: 'Order limit reached. Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Cart rate limiter - prevents cart bombing
export const cartLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 cart additions per minute (strict)
    message: {
        success: false,
        error: 'Too many cart requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Search/product listing rate limiter - prevents scraping
export const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute (strict)
    message: {
        success: false,
        error: 'Too many requests. Please try again in a moment'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Product create rate limiter - prevents bulk creation
export const productCreateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 products per minute (strict)
    message: {
        success: false,
        error: 'Product creation limit reached. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Product modify rate limiter - prevents mass update/delete
export const productModifyLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 update/delete operations per minute
    message: {
        success: false,
        error: 'Too many product modifications. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Product read rate limiter - single product fetch, categories
export const productReadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 reads per minute
    message: {
        success: false,
        error: 'Too many product requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Cart modify rate limiter - update/delete cart items
export const cartModifyLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 cart modifications per minute
    message: {
        success: false,
        error: 'Too many cart modifications. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Admin read rate limiter - list customers, orders, audit logs
export const adminReadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 admin read operations per minute
    message: {
        success: false,
        error: 'Too many requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});

// Notification rate limiter - all notification operations
export const notificationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 notification operations per minute
    message: {
        success: false,
        error: 'Too many notification requests. Please slow down'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    validate: { trustProxy: false }
});