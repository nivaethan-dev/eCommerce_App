/**
 * Product Validation Schemas
 * 
 * Schemas for product CRUD and search operations
 */

import { z } from 'zod';
import { 
  objectIdSchema, 
  paginationSchema, 
  searchQuerySchema,
  positiveIntSchema,
  nonNegativeIntSchema,
  priceSchema 
} from './commonSchemas.js';
import { trimString } from '../sanitizers.js';

/**
 * Valid product categories (must match ProductService.VALID_CATEGORIES)
 */
const VALID_CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];
const VALID_CATEGORIES_LOWER = VALID_CATEGORIES.map((c) => c.toLowerCase());

/**
 * Category validation helper
 */
const categorySchema = z
  .string()
  .transform(trimString)
  .refine(
    (val) => VALID_CATEGORIES_LOWER.includes(val.toLowerCase()),
    { message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` }
  );

/**
 * Create product schema
 */
export const createProductSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .transform(trimString)
    .refine((val) => val.length >= 3, { message: 'Title must be at least 3 characters' })
    .refine((val) => val.length <= 100, { message: 'Title must be at most 100 characters' }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description is required')
    .transform(trimString)
    .refine((val) => val.length >= 10, { message: 'Description must be at least 10 characters' })
    .refine((val) => val.length <= 1000, { message: 'Description must be at most 1000 characters' }),
  stock: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? -1 : num;
    })
    .refine((val) => val >= 0, { message: 'Stock must be a non-negative number' }),
  category: categorySchema,
  price: priceSchema.refine((val) => val > 0, { message: 'Price must be greater than 0' })
});

/**
 * Update product schema (all fields optional)
 */
export const updateProductSchema = z.object({
  title: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : undefined))
    .refine((val) => !val || val.length >= 3, { message: 'Title must be at least 3 characters' })
    .refine((val) => !val || val.length <= 100, { message: 'Title must be at most 100 characters' }),
  description: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : undefined))
    .refine((val) => !val || val.length >= 10, { message: 'Description must be at least 10 characters' })
    .refine((val) => !val || val.length <= 1000, { message: 'Description must be at most 1000 characters' }),
  stock: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || val >= 0, { message: 'Stock must be a non-negative number' }),
  category: z
    .string()
    .optional()
    .transform((val) => (val ? trimString(val) : undefined))
    .refine(
      (val) => !val || VALID_CATEGORIES_LOWER.includes(val.toLowerCase()),
      { message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` }
    ),
  price: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      const num = typeof val === 'string' ? parseFloat(val) : val;
      return isNaN(num) ? undefined : Math.round(num * 100) / 100;
    })
    .refine((val) => val === undefined || val > 0, { message: 'Price must be greater than 0' })
});

/**
 * Product query schema (for listing/search)
 */
export const productQuerySchema = paginationSchema
  .merge(searchQuerySchema)
  .extend({
    category: z.string().optional().transform((val) => val?.trim())
  });

/**
 * Product ID param schema
 */
export const productIdParamSchema = z.object({
  productId: objectIdSchema
});

