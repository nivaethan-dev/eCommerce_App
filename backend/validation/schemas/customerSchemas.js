/**
 * Customer Validation Schemas
 * 
 * Schemas for cart operations and customer-related endpoints
 */

import { z } from 'zod';
import { objectIdSchema, positiveIntSchema, nonNegativeIntSchema } from './commonSchemas.js';

/**
 * Add item to cart schema
 */
export const addCartItemSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .min(1, 'Product ID is required')
    .pipe(objectIdSchema),
  quantity: positiveIntSchema
});

/**
 * Update cart item schema (quantity can be 0 to remove)
 */
export const updateCartItemSchema = z.object({
  quantity: nonNegativeIntSchema
});

/**
 * Cart product ID param schema
 */
export const cartProductIdParamSchema = z.object({
  productId: objectIdSchema
});

/**
 * Order item schema (for Buy It Now)
 */
const orderItemSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .min(1, 'Product ID is required')
    .pipe(objectIdSchema),
  quantity: positiveIntSchema
});

/**
 * Place order schema
 * - items: optional array for Buy It Now
 * - If items not provided, order is created from cart
 */
export const placeOrderSchema = z.object({
  items: z.array(orderItemSchema).optional()
});

/**
 * Customer search query schema (for admin)
 */
export const customerSearchQuerySchema = z.object({
  search: z.string().optional().transform((val) => val?.trim())
});

