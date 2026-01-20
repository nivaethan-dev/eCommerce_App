import express from 'express';
import * as auditController from '../controllers/auditLogController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { validateParams, validateQuery } from '../validation/middleware.js';
import { 
  auditLogQuerySchema, 
  auditLogStatsQuerySchema, 
  auditLogIdParamSchema 
} from '../validation/schemas/auditLogSchemas.js';

const router = express.Router();

// Apply middleware
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', validateQuery(auditLogQuerySchema), auditController.getAuditLogs);
router.get('/stats', validateQuery(auditLogStatsQuerySchema), auditController.getAuditStats);
router.get('/filter-values', auditController.getDistinctFilterValues);
router.get('/:id', validateParams(auditLogIdParamSchema), auditController.getAuditLogById);

export default router;
