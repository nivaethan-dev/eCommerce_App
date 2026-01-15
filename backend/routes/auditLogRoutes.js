import express from 'express';
import * as auditController from '../controllers/auditLogController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply middleware
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', auditController.getAuditLogs);
router.get('/stats', auditController.getAuditStats);
router.get('/filter-values', auditController.getDistinctFilterValues);
router.get('/:id', auditController.getAuditLogById);

export default router;
