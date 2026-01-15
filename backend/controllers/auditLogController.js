import * as auditService from '../services/auditLogService.js';
import AuditLog from '../models/AuditLog.js';

export const getAuditLogs = async (req, res) => {
  try {
    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Build filters object from query parameters
    const filters = {};
    if (req.query.action) filters.action = req.query.action;
    if (req.query.userType) filters.userType = req.query.userType;
    if (req.query.resource) filters.resource = req.query.resource;
    if (req.query.status) filters.status = req.query.status;

    // Handle date range filtering
    if (req.query.startDate || req.query.endDate) {
      filters.timestamp = {};
      if (req.query.startDate) {
        filters.timestamp.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        // Set to end of day for endDate
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        filters.timestamp.$lte = endDate;
      }
    }

    // Get logs with pagination
    const logs = await auditService.getAuditLogs(filters, { page, limit });
    
    // Get total count for pagination
    const total = await AuditLog.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    res.json({
      logs,
      total,
      totalPages,
      currentPage: page,
      pageSize: limit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuditLogById = async (req, res) => {
  try {
    const log = await auditService.getAuditLogs({ _id: req.params.id });
    res.json(log[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAuditStats = async (req, res) => {
  try {
    // Build date range object from query parameters
    const dateRange = {};
    if (req.query.startDate) {
      dateRange.startDate = req.query.startDate;
    }
    if (req.query.endDate) {
      dateRange.endDate = req.query.endDate;
    }

    const stats = await auditService.getAuditStats(dateRange);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDistinctFilterValues = async (req, res) => {
  try {
    const filterValues = await auditService.getDistinctFilterValues();
    res.json(filterValues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
