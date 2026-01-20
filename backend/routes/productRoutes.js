import express from 'express';
import { createProduct, fetchProducts, fetchProductCategories, fetchProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import { productUploadBundle, requireImage } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { productCreateLimiter, productModifyLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody, validateParams, validateQuery } from '../validation/middleware.js';
import { 
  createProductSchema, 
  updateProductSchema, 
  productQuerySchema, 
  productIdParamSchema 
} from '../validation/schemas/productSchemas.js';

const router = express.Router();

// Create product - protected route, only admins can create products
router.post(
  '/create',
  authMiddleware,
  roleMiddleware('admin'),
  productCreateLimiter,
  productUploadBundle,
  requireImage, // Enforce image requirement for new products
  validateBody(createProductSchema),
  createProduct
);

// Fetch products (public reads - no rate limit, use caching instead)
router.get('/categories', fetchProductCategories);
router.get('/:productId', validateParams(productIdParamSchema), fetchProductById);
router.get('/', validateQuery(productQuerySchema), fetchProducts);

// Update product - Admin only
router.patch(
  '/:productId',
  authMiddleware,
  roleMiddleware('admin'),
  productModifyLimiter,
  productUploadBundle, // Image is optional here (validateImage skips if no file)
  validateParams(productIdParamSchema),
  validateBody(updateProductSchema),
  updateProduct
);

// Delete product - Admin only
router.delete(
  '/:productId',
  authMiddleware,
  roleMiddleware('admin'),
  productModifyLimiter,
  validateParams(productIdParamSchema),
  deleteProduct
);

export default router;
