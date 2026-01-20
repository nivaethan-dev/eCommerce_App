/**
 * Notification Validation Schemas
 * 
 * Schemas for notification endpoints
 */

import { z } from 'zod';
import { objectIdSchema, paginationSchema } from './commonSchemas.js';

/**
 * Valid notification status filters
 */
const VALID_STATUSES = ['all', 'read', 'unread'];

/**
 * Valid sort options
 */
const VALID_SORT_OPTIONS = ['newest', 'oldest'];

/**
 * Notification query schema
 */
export const notificationQuerySchema = paginationSchema.extend({
  status: z
    .string()
    .optional()
    .default('all')
    .refine(
      (val) => VALID_STATUSES.includes(val),
      { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }
    ),
  sortBy: z
    .string()
    .optional()
    .default('newest')
    .refine(
      (val) => VALID_SORT_OPTIONS.includes(val),
      { message: `Invalid sortBy. Must be one of: ${VALID_SORT_OPTIONS.join(', ')}` }
    )
});

/**
 * Notification ID param schema
 */
export const notificationIdParamSchema = z.object({
  id: objectIdSchema
});

