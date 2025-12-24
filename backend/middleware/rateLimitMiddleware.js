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
    skipSuccessfulRequests: false, // Count successful attempts too
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