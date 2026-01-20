/**
 * Generic Validation Middleware
 * 
 * Provides factory functions for validating request body, params, and query
 * using Zod schemas. Returns consistent error responses.
 */

/**
 * Validates request body against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => err.message);
    return res.status(400).json({
      success: false,
      error: errors.length === 1 ? errors[0] : 'Validation failed',
      errors
    });
  }

  // Replace body with sanitized/transformed data
  req.body = result.data;
  next();
};

/**
 * Validates request params against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const errors = result.error.errors.map((err) => err.message);
    return res.status(400).json({
      success: false,
      error: errors[0] // Param errors are usually single
    });
  }

  next();
};

/**
 * Validates request query against a Zod schema
 * Attaches sanitized query to req.validatedQuery
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const errors = result.error.errors.map((err) => err.message);
    return res.status(400).json({
      success: false,
      error: errors[0]
    });
  }

  // Attach sanitized query for use in controller
  req.validatedQuery = result.data;
  next();
};

