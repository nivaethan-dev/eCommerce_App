import express from 'express';
import { registerCustomer, addToCart, removeFromCart } from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { registerLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/register', registerLimiter, registerCustomer);
router.post('/cart/add', authMiddleware, addToCart);
router.post('/cart/remove', authMiddleware, removeFromCart);

export default router;
