import express from 'express';
import { registerCustomer, loginCustomer, addToCart, removeFromCart } from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/cart/add', authMiddleware, addToCart);
router.post('/cart/remove', authMiddleware, removeFromCart);

export default router;
