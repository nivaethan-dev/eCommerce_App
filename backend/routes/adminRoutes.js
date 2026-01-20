import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { adminReadLimiter } from '../middleware/rateLimitMiddleware.js';
import { fetchCustomers } from '../controllers/customerController.js';
import { listAllOrders, updateOrder } from '../controllers/orderController.js';
import { validateBody, validateParams, validateQuery } from '../validation/middleware.js';
import { customerSearchQuerySchema } from '../validation/schemas/customerSchemas.js';
import { 
  updateOrderStatusSchema, 
  listOrdersQuerySchema, 
  orderIdParamSchema 
} from '../validation/schemas/orderSchemas.js';

const router = express.Router();

// Fetch customers - Admin only
router.get('/customers', authMiddleware, roleMiddleware('admin'), adminReadLimiter, validateQuery(customerSearchQuerySchema), fetchCustomers);

// Order management - Admin only
router.get('/orders', authMiddleware, roleMiddleware('admin'), adminReadLimiter, validateQuery(listOrdersQuerySchema), listAllOrders);           // GET /orders - List all orders
router.put('/orders/:orderId', authMiddleware, roleMiddleware('admin'), adminReadLimiter, validateParams(orderIdParamSchema), validateBody(updateOrderStatusSchema), updateOrder);     // PUT /orders/:orderId - Update order status

export default router;
