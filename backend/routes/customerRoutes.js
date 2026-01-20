import express from 'express';
import { registerCustomer, addCartItem, removeCartItem, getCart, updateCartItem } from '../controllers/customerController.js';
import { placeOrder, getOrders } from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { registerLimiter, orderLimiter, cartLimiter, cartModifyLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody, validateParams } from '../validation/middleware.js';
import { registerSchema } from '../validation/schemas/authSchemas.js';
import { 
  addCartItemSchema, 
  updateCartItemSchema, 
  cartProductIdParamSchema,
  placeOrderSchema 
} from '../validation/schemas/customerSchemas.js';

const router = express.Router();

router.post('/register', registerLimiter, validateBody(registerSchema), registerCustomer);

// Cart REST API endpoints - following proper REST resource naming
router.get('/cart', authMiddleware, getCart);                           // GET /cart - Retrieve cart (no rate limit - read only)
router.post('/cart/items', authMiddleware, cartLimiter, validateBody(addCartItemSchema), addCartItem);                // POST /cart/items - Add item to cart
router.put('/cart/items/:productId', authMiddleware, cartModifyLimiter, validateParams(cartProductIdParamSchema), validateBody(updateCartItemSchema), updateCartItem);  // PUT /cart/items/:productId - Update item quantity
router.delete('/cart/items/:productId', authMiddleware, cartModifyLimiter, validateParams(cartProductIdParamSchema), removeCartItem); // DELETE /cart/items/:productId - Remove item from cart

// Order endpoints
router.post('/orders', authMiddleware, orderLimiter, validateBody(placeOrderSchema), placeOrder);                     // POST /orders - Place order (simulated checkout)
router.get('/orders', authMiddleware, getOrders);                      // GET /orders - Get customer order history (no rate limit - read only)

export default router;
