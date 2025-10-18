import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { fetchCustomers } from '../controllers/customerController.js';

const router = express.Router();

// Fetch customers - Admin only
router.get('/customers', authMiddleware, roleMiddleware('admin'), fetchCustomers);

export default router;
