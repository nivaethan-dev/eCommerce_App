/**
 * Rate Limit Configuration with Secure Defaults
 * 
 * This module validates and provides safe numeric values for all rate limiting
 * parameters. If any environment variable is missing or invalid, it falls back
 * to secure defaults.
 * 
 * Security: OWASP A05 - Security Misconfiguration Prevention
 * CWE-16: Configuration (Prevention of silent security failures)
 */

import { isProduction } from '../utils/errorUtils.js';

const isDev = !isProduction();

/**
 * Safely parse an integer from environment variable with fallback
 * @param {string} envVarName - Name of the environment variable
 * @param {number} defaultValue - Default value if env var is missing/invalid
 * @param {string} description - Human-readable description for logging
 * @returns {number} Validated integer value
 */
function getSecureEnvInt(envVarName, defaultValue, description) {
    const envValue = process.env[envVarName];

    // If env var is not set, use default
    if (!envValue) {
        // Only log in development to avoid information disclosure in production
        if (isDev) {
            console.warn(`[CONFIG] ${envVarName} not set, using default: ${defaultValue}`);
        }
        return defaultValue;
    }

    // Parse with base 10
    const parsed = parseInt(envValue, 10);

    // Validate the parsed value
    if (isNaN(parsed) || parsed <= 0) {
        // In production, throw error - misconfiguration is critical
        // In development, log warning and use default
        if (isProduction()) {
            throw new Error(`Invalid rate limit configuration: ${envVarName} must be a positive integer`);
        } else {
            console.warn(`[CONFIG] Invalid ${envVarName}, using default: ${defaultValue}`);
        }
        return defaultValue;
    }

    return parsed;
}

// =============================================================================
// AUTHENTICATION RATE LIMITS
// =============================================================================

export const MAX_ATTEMPTS = getSecureEnvInt(
    'MAX_ATTEMPTS',
    5,
    'Account lockout - max login attempts'
);

export const LOCK_TIME = getSecureEnvInt(
    'LOCK_TIME',
    15 * 60 * 1000, // 15 minutes
    'Account lockout duration (ms)'
);

export const LOGIN_MAX_ATTEMPTS = getSecureEnvInt(
    'LOGIN_MAX_ATTEMPTS',
    5,
    'Login IP rate limit - max attempts'
);

export const LOGIN_LOCK_TIME = getSecureEnvInt(
    'LOGIN_LOCK_TIME',
    15 * 60 * 1000, // 15 minutes
    'Login IP rate limit duration (ms)'
);

export const REGISTER_MAX_ATTEMPTS = getSecureEnvInt(
    'REGISTER_MAX_ATTEMPTS',
    3,
    'Registration max attempts per hour'
);

export const REGISTER_LOCK_TIME = getSecureEnvInt(
    'REGISTER_LOCK_TIME',
    60 * 60 * 1000, // 1 hour
    'Registration rate limit window (ms)'
);

export const REFRESH_TOKEN_MAX_ATTEMPTS = getSecureEnvInt(
    'REFRESH_TOKEN_MAX_ATTEMPTS',
    5,
    'Refresh token max requests per minute'
);

export const REFRESH_TOKEN_WINDOW = getSecureEnvInt(
    'REFRESH_TOKEN_WINDOW',
    60 * 1000, // 1 minute
    'Refresh token rate limit window (ms)'
);

// =============================================================================
// SHOPPING CART RATE LIMITS
// =============================================================================

export const CART_MAX_ATTEMPTS = getSecureEnvInt(
    'CART_MAX_ATTEMPTS',
    10,
    'Cart additions per minute'
);

export const CART_WINDOW = getSecureEnvInt(
    'CART_WINDOW',
    60 * 1000, // 1 minute
    'Cart rate limit window (ms)'
);

export const CART_MODIFY_MAX_ATTEMPTS = getSecureEnvInt(
    'CART_MODIFY_MAX_ATTEMPTS',
    30,
    'Cart modifications per minute'
);

export const CART_MODIFY_WINDOW = getSecureEnvInt(
    'CART_MODIFY_WINDOW',
    60 * 1000, // 1 minute
    'Cart modify rate limit window (ms)'
);

// =============================================================================
// ORDER RATE LIMITS
// =============================================================================

export const ORDER_MAX_ATTEMPTS = getSecureEnvInt(
    'ORDER_MAX_ATTEMPTS',
    5,
    'Orders per hour'
);

export const ORDER_WINDOW = getSecureEnvInt(
    'ORDER_WINDOW',
    60 * 60 * 1000, // 1 hour
    'Order rate limit window (ms)'
);

// =============================================================================
// PRODUCT RATE LIMITS
// =============================================================================

export const PRODUCT_SEARCH_MAX_ATTEMPTS = getSecureEnvInt(
    'PRODUCT_SEARCH_MAX_ATTEMPTS',
    60,
    'Product search requests per minute'
);

export const PRODUCT_SEARCH_WINDOW = getSecureEnvInt(
    'PRODUCT_SEARCH_WINDOW',
    60 * 1000, // 1 minute
    'Product search rate limit window (ms)'
);

export const PRODUCT_CREATE_MAX_ATTEMPTS = getSecureEnvInt(
    'PRODUCT_CREATE_MAX_ATTEMPTS',
    5,
    'Product creations per minute'
);

export const PRODUCT_CREATE_WINDOW = getSecureEnvInt(
    'PRODUCT_CREATE_WINDOW',
    60 * 1000, // 1 minute
    'Product create rate limit window (ms)'
);

export const PRODUCT_MODIFY_MAX_ATTEMPTS = getSecureEnvInt(
    'PRODUCT_MODIFY_MAX_ATTEMPTS',
    10,
    'Product modifications per minute'
);

export const PRODUCT_MODIFY_WINDOW = getSecureEnvInt(
    'PRODUCT_MODIFY_WINDOW',
    60 * 1000, // 1 minute
    'Product modify rate limit window (ms)'
);

export const PRODUCT_READ_MAX_ATTEMPTS = getSecureEnvInt(
    'PRODUCT_READ_MAX_ATTEMPTS',
    60,
    'Product reads per minute'
);

export const PRODUCT_READ_WINDOW = getSecureEnvInt(
    'PRODUCT_READ_WINDOW',
    60 * 1000, // 1 minute
    'Product read rate limit window (ms)'
);

// =============================================================================
// ADMIN RATE LIMITS
// =============================================================================

export const ADMIN_READ_MAX_ATTEMPTS = getSecureEnvInt(
    'ADMIN_READ_MAX_ATTEMPTS',
    30,
    'Admin read operations per minute'
);

export const ADMIN_READ_WINDOW = getSecureEnvInt(
    'ADMIN_READ_WINDOW',
    60 * 1000, // 1 minute
    'Admin read rate limit window (ms)'
);

// =============================================================================
// NOTIFICATION RATE LIMITS
// =============================================================================

export const NOTIFICATION_MAX_ATTEMPTS = getSecureEnvInt(
    'NOTIFICATION_MAX_ATTEMPTS',
    60,
    'Notification operations per minute'
);

export const NOTIFICATION_WINDOW = getSecureEnvInt(
    'NOTIFICATION_WINDOW',
    60 * 1000, // 1 minute
    'Notification rate limit window (ms)'
);

// Development-only startup validation logging
if (isDev) {
    console.log('[CONFIG] Rate limit configurations loaded');
}
