/**
 * Authentication Validation Schemas
 * 
 * Schemas for login and register endpoints
 */

import { z } from 'zod';
import validator from 'validator';
import { normalizeEmail, normalizeSriLankanPhone, sanitizeString } from '../sanitizers.js';

/**
 * Login schema
 * - Email: normalized and lowercased
 * - Password: required (no modification)
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .transform(normalizeEmail)
    .refine((val) => validator.isEmail(val), { message: 'Invalid email format' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
});

/**
 * Register schema
 * - Name: sanitized, 2-100 chars
 * - Email: normalized and validated
 * - Phone: normalized to +94 format and validated
 * - Password: strong password requirements
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .transform(sanitizeString)
    .refine((val) => val.length >= 2, { message: 'Name must be at least 2 characters' })
    .refine((val) => val.length <= 100, { message: 'Name must be at most 100 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .transform(normalizeEmail)
    .refine((val) => validator.isEmail(val), { message: 'Invalid email' }),
  phone: z
    .string({ required_error: 'Phone is required' })
    .min(1, 'Phone is required')
    .transform(normalizeSriLankanPhone)
    .refine((val) => validator.isMobilePhone(val, 'si-LK'), { message: 'Invalid phone number' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .refine(
      (val) => validator.isStrongPassword(val, {
        minLength: 12,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1
      }),
      { message: 'Password must be at least 12 characters with uppercase, lowercase, number, and symbol' }
    )
});

