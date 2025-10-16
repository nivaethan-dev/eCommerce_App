import express from 'express';
import { refreshToken, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Common auth routes
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;
