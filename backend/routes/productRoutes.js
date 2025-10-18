import express from 'express';
import { createProduct } from '../controllers/productController.js';
import { uploadProductImage, validateImage } from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { adminUploadRateLimit } from '../middleware/uploadRateLimit.js';

const router = express.Router();

// Create product - protected route, only admins can create products
router.post(
  '/create',
  adminUploadRateLimit, // Rate limiting for admin uploads
  authMiddleware,
  roleMiddleware('admin'),
  uploadProductImage,
  validateImage,
  createProduct
);

export default router;
