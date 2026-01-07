/**
 * Centralized Authentication Configuration
 * All time-related constants for auth in one place
 */

export const AUTH_CONFIG = {
  // JWT Token Expiration Times
  // ACCESS_TOKEN_EXPIRY: '15m',           // 15 minutes (Production)
  // REFRESH_TOKEN_EXPIRY: '6h',           // 6 hours (Production)
  ACCESS_TOKEN_EXPIRY: '1m',           // 1 minute (Development)
  REFRESH_TOKEN_EXPIRY: '2m',  // 2 minutes (Development)

  // Cookie Max Age (in milliseconds)
  // ACCESS_TOKEN_MAX_AGE: 15 * 60 * 1000,        // 15 minutes in ms
  // REFRESH_TOKEN_MAX_AGE: 6 * 60 * 60 * 1000,   // 6 hours in ms
  ACCESS_TOKEN_MAX_AGE: 1 * 60 * 1000,        // 1 minute in ms
  REFRESH_TOKEN_MAX_AGE: 2 * 60 * 1000,   // 2 minutes in ms
  
  // Session and Security
  SESSION_ABSOLUTE_TIMEOUT_HOURS: 6,    // Maximum session duration
  ACCOUNT_LOCK_TIME: 15 * 60 * 1000,    // 15 minutes in ms
  
  // Login Attempts
  MAX_LOGIN_ATTEMPTS: 5,                // Before account lock
};

// Helper functions for time conversions
export const timeHelpers = {
  /**
   * Convert hours to milliseconds
   */
  hoursToMs: (hours) => hours * 60 * 60 * 1000,
  
  /**
   * Convert minutes to milliseconds
   */
  minutesToMs: (minutes) => minutes * 60 * 1000,
  
  /**
   * Get session duration in hours from milliseconds
   */
  msToHours: (ms) => ms / (60 * 60 * 1000),
};

