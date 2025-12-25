import express from 'express';
import { createProduct, fetchProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { uploadProductImage, processImage, validateImage, handleUploadError } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create product - protected route, only admins can create products
router.post(
  '/create',
  authMiddleware,
  roleMiddleware('admin'),
  uploadProductImage,
  handleUploadError, // Handle multer errors with proper response format
  processImage, // Resize and optimize images to consistent dimensions
  validateImage,
  createProduct
);

// Fetch products 
router.get('/', fetchProducts);

// Update product - Admin only
router.put(
  '/:productId',
  authMiddleware,
  roleMiddleware('admin'),
  uploadProductImage, // Handle potential image update
  handleUploadError,
  processImage, // Process image if uploaded
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
