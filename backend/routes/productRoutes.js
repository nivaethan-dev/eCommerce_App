import express from 'express';
import { createProduct, fetchProducts, fetchProductCategories, fetchProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import { productUploadBundle, requireImage } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create product - protected route, only admins can create products
router.post(
  '/create',
  authMiddleware,
  roleMiddleware('admin'),
  productUploadBundle,
  requireImage, // Enforce image requirement for new products
  createProduct
);

// Fetch products 
router.get('/categories', fetchProductCategories);
router.get('/:productId', fetchProductById);
router.get('/', fetchProducts);

// Update product - Admin only
router.patch(
  '/:productId',
  authMiddleware,
  roleMiddleware('admin'),
  productUploadBundle, // Image is optional here (validateImage skips if no file)
  updateProduct
);

// Delete product - Admin only
router.delete(
  '/:productId',
  authMiddleware,
  roleMiddleware('admin'),
  deleteProduct
);

export default router;
