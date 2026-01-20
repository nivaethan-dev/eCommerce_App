import express from 'express';
import { refreshToken, logout, login } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { loginLimiter, refreshTokenLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody } from '../validation/middleware.js';
import { loginSchema } from '../validation/schemas/authSchemas.js';

const router = express.Router();

// Common auth routes
router.post('/login', loginLimiter, validateBody(loginSchema), login);
router.post('/refresh-token', refreshTokenLimiter, refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;
