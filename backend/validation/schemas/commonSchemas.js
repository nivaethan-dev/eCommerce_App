/**
 * Common Validation Schemas
 * 
 * Reusable schemas for ObjectIds, pagination, date ranges, etc.
 */

import { z } from 'zod';
import mongoose from 'mongoose';
import { escapeRegex } from '../sanitizers.js';

/**
 * MongoDB ObjectId validation schema
 */
export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid ID format' }
);

/**
 * Pagination schema with defaults
 * Transforms string values to numbers
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) || num < 1 ? 1 : num;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) || num < 1 ? 20 : Math.min(num, 100);
    })
});

/**
 * Date range schema for filtering
 */
export const dateRangeSchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid start date format'
    }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid end date format'
    })
});

/**
 * Search query schema with regex escaping for ReDoS prevention
 */
export const searchQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .transform((val) => (val ? escapeRegex(val.trim()) : undefined))
});

/**
 * Positive integer schema (for quantities, etc.)
 */
export const positiveIntSchema = z
  .union([z.string(), z.number()])
  .transform((val) => {
    const num = typeof val === 'string' ? parseInt(val, 10) : val;
    return isNaN(num) ? 0 : num;
  })
  .refine((val) => val >= 1, { message: 'Must be at least 1' });

/**
 * Non-negative integer schema (for updates where 0 is allowed)
 */
export const nonNegativeIntSchema = z
  .union([z.string(), z.number()])
  .transform((val) => {
    const num = typeof val === 'string' ? parseInt(val, 10) : val;
    return isNaN(num) ? 0 : num;
  })
  .refine((val) => val >= 0, { message: 'Must be non-negative' });

/**
 * Price schema (transforms to 2 decimal places)
 */
export const priceSchema = z
  .union([z.string(), z.number()])
  .transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
  })
  .refine((val) => val >= 0, { message: 'Price must be non-negative' });

