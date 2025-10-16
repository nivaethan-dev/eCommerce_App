import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Admin routes will be added here
// All admin routes should be protected with authMiddleware and roleMiddleware

export default router;
