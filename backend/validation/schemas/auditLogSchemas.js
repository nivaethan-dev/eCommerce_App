/**
 * Audit Log Validation Schemas
 * 
 * Schemas for audit log endpoints
 */

import { z } from 'zod';
import { objectIdSchema, paginationSchema, dateRangeSchema } from './commonSchemas.js';

/**
 * Valid user types for filtering
 */
const VALID_USER_TYPES = ['Customer', 'Admin'];

/**
 * Valid statuses for filtering
 */
const VALID_STATUSES = ['success', 'failure'];

/**
 * Audit log query schema
 * Includes pagination, date range, and various filters
 */
export const auditLogQuerySchema = paginationSchema
  .merge(dateRangeSchema)
  .extend({
    action: z.string().optional(),
    userType: z
      .string()
      .optional()
      .refine(
        (val) => !val || VALID_USER_TYPES.includes(val),
        { message: `Invalid userType. Must be one of: ${VALID_USER_TYPES.join(', ')}` }
      ),
    resource: z.string().optional(),
    status: z
      .string()
      .optional()
      .refine(
        (val) => !val || VALID_STATUSES.includes(val),
        { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }
      )
  });

/**
 * Audit log stats query schema
 */
export const auditLogStatsQuerySchema = dateRangeSchema;

/**
 * Audit log ID param schema
 */
export const auditLogIdParamSchema = z.object({
  id: objectIdSchema
});

