import * as auditService from '../services/auditLogService.js';
import AuditLog from '../models/AuditLog.js';
import { formatErrorResponse } from '../utils/errorUtils.js';

export const getAuditLogs = async (req, res) => {
  try {
    // Validation handled by middleware - query params are sanitized
    const query = req.validatedQuery || req.query;

    const page = query.page || 1;
    const limit = query.limit || 20;

    // Build filters object from validated query parameters
    const filters = {};
    if (query.action) filters.action = query.action;
    if (query.userType) filters.userType = query.userType;
    if (query.resource) filters.resource = query.resource;
    if (query.status) filters.status = query.status;
    if (query.country) filters['geolocation.country'] = query.country;

    // Handle date range filtering
    if (query.startDate || query.endDate) {
      filters.timestamp = {};
      if (query.startDate) {
        filters.timestamp.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        // Set to end of day for endDate
        const endDate = new Date(query.endDate);
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
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};

export const getAuditLogById = async (req, res) => {
  try {
    const log = await auditService.getAuditLogs({ _id: req.params.id });
    res.json(log[0] || null);
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};

export const getAuditStats = async (req, res) => {
  try {
    // Validation handled by middleware - query params are sanitized
    const query = req.validatedQuery || req.query;

    const dateRange = {};
    if (query.startDate) {
      dateRange.startDate = query.startDate;
    }
    if (query.endDate) {
      dateRange.endDate = query.endDate;
    }

    const stats = await auditService.getAuditStats(dateRange);
    res.json(stats);
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};

export const getDistinctFilterValues = async (req, res) => {
  try {
    const filterValues = await auditService.getDistinctFilterValues();
    res.json(filterValues);
  } catch (error) {
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};
