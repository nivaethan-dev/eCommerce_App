/**
 * Sanitization Utilities
 * 
 * Provides reusable sanitization functions for use with Zod transforms
 * and direct usage in query helpers.
 */

import validator from 'validator';

/**
 * Escapes special regex characters to prevent ReDoS attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for use in regex
 */
export const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Normalizes email using validator library
 * @param {string} email - Email to normalize
 * @returns {string} Normalized email
 */
export const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  const trimmed = validator.trim(email);
  return validator.normalizeEmail(trimmed) || trimmed.toLowerCase();
};

/**
 * Normalizes Sri Lankan phone number to +94 format
 * @param {string} phone - Phone number to normalize
 * @returns {string} Normalized phone number
 */
export const normalizeSriLankanPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  const trimmed = validator.trim(phone);
  
  // Already has +94 prefix
  if (trimmed.startsWith('+94')) {
    return trimmed;
  }
  
  // Has 94 prefix without +
  if (trimmed.startsWith('94')) {
    return '+' + trimmed;
  }
  
  // Starts with 0, replace with +94
  if (trimmed.startsWith('0')) {
    return '+94' + trimmed.slice(1);
  }
  
  // Just the number without prefix
  return '+94' + trimmed;
};

/**
 * Trims and escapes string for XSS prevention
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return validator.trim(validator.escape(str));
};

/**
 * Trims string without escaping (for non-HTML fields)
 * @param {string} str - String to trim
 * @returns {string} Trimmed string
 */
export const trimString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return validator.trim(str);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} Whether password is strong enough
 */
export const isStrongPassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 12,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1
  });
};

