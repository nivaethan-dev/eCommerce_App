import express from 'express';
import { createProduct, fetchProducts } from '../controllers/productController.js';
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

export default router;
