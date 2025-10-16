import express from 'express';
import { refreshToken, logout, login } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Common auth routes
router.post('/login', loginLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;
