import express from 'express';
import { 
  getSecurityDashboard, 
  getQuarantinedFiles, 
  cleanSecurityLogs, 
  deleteQuarantinedFile 
} from '../controllers/securityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All security routes require admin authentication
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Get security dashboard data
router.get('/dashboard', getSecurityDashboard);

// Get quarantined files list
router.get('/quarantine', getQuarantinedFiles);

// Clean old security logs
router.post('/logs/clean', cleanSecurityLogs);

// Delete a quarantined file
router.delete('/quarantine/:filename', deleteQuarantinedFile);

export default router;
