import express from 'express';
import { createProduct } from '../controllers/productController.js';
import { uploadProductImage, validateImage } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create product - protected route, only admins can create products
router.post(
  '/create',
  authMiddleware,
  roleMiddleware('admin'),
  uploadProductImage,
  validateImage,
  createProduct
);

export default router;
