import express from 'express';
import { refreshToken, logout, login } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { loginLimiter, refreshTokenLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Common auth routes
router.post('/login', loginLimiter, login);
router.post('/refresh-token', refreshTokenLimiter, refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;
