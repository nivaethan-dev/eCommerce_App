import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // sets req.user
import { notificationLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateParams, validateQuery } from '../validation/middleware.js';
import { 
  notificationQuerySchema, 
  notificationIdParamSchema 
} from '../validation/schemas/notificationSchemas.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Read endpoints (no rate limit)
router.get('/', validateQuery(notificationQuerySchema), notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

// Write endpoints (rate limited)
router.put('/:id/read', notificationLimiter, validateParams(notificationIdParamSchema), notificationController.markAsRead);
router.put('/read-all', notificationLimiter, notificationController.markAllAsRead);
router.delete('/:id', notificationLimiter, validateParams(notificationIdParamSchema), notificationController.deleteNotification);

export default router;
