import express from 'express';
import { refreshToken } from '../controllers/authController.js';

const router = express.Router();

// Common auth routes
router.post('/refresh-token', refreshToken);

export default router;
