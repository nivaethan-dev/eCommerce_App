import express from 'express';
import { registerCustomer, addCartItem, removeCartItem, getCart, updateCartItem } from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { registerLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/register', registerLimiter, registerCustomer);

// Cart REST API endpoints - following proper REST resource naming
router.get('/cart', authMiddleware, getCart);                           // GET /cart - Retrieve cart
router.post('/cart/items', authMiddleware, addCartItem);                // POST /cart/items - Add item to cart
router.put('/cart/items/:productId', authMiddleware, updateCartItem);  // PUT /cart/items/:productId - Update item quantity
router.delete('/cart/items/:productId', authMiddleware, removeCartItem); // DELETE /cart/items/:productId - Remove item from cart

export default router;
