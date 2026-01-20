/**
 * Order Validation Schemas
 * 
 * Schemas for order management endpoints
 */

import { z } from 'zod';
import { objectIdSchema } from './commonSchemas.js';

/**
 * Valid order statuses (must match VALID_ORDER_STATUSES in orderMessages.js)
 */
const VALID_ORDER_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

/**
 * Update order status schema
 */
export const updateOrderStatusSchema = z.object({
  status: z
    .string({ required_error: 'Status is required' })
    .min(1, 'Status is required')
    .refine(
      (val) => VALID_ORDER_STATUSES.includes(val),
      { message: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}` }
    )
});

/**
 * List orders query schema (admin)
 */
export const listOrdersQuerySchema = z.object({
  status: z
    .string()
    .optional()
    .refine(
      (val) => !val || VALID_ORDER_STATUSES.includes(val),
      { message: `Invalid status filter. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}` }
    ),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) ? 50 : num;
    })
    .refine((val) => val >= 1 && val <= 100, { message: 'Limit must be between 1 and 100' }),
  skip: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) ? 0 : num;
    })
    .refine((val) => val >= 0, { message: 'Skip must be a non-negative number' })
});

/**
 * Order ID param schema
 */
export const orderIdParamSchema = z.object({
  orderId: objectIdSchema
});

