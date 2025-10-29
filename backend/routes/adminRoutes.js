import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { fetchCustomers } from '../controllers/customerController.js';
import { listAllOrders, updateOrder } from '../controllers/orderController.js';

const router = express.Router();

// Fetch customers - Admin only
router.get('/customers', authMiddleware, roleMiddleware('admin'), fetchCustomers);

// Order management - Admin only
router.get('/orders', authMiddleware, roleMiddleware('admin'), listAllOrders);           // GET /orders - List all orders
router.put('/orders/:orderId', authMiddleware, roleMiddleware('admin'), updateOrder);     // PUT /orders/:orderId - Update order status

export default router;
