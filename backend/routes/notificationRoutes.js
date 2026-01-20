import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // sets req.user
import { validateParams, validateQuery } from '../validation/middleware.js';
import { 
  notificationQuerySchema, 
  notificationIdParamSchema 
} from '../validation/schemas/notificationSchemas.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', validateQuery(notificationQuerySchema), notificationController.getNotifications);
router.put('/:id/read', validateParams(notificationIdParamSchema), notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', validateParams(notificationIdParamSchema), notificationController.deleteNotification);
router.get('/unread-count', notificationController.getUnreadCount);

export default router;
