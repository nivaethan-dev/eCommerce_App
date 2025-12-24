import AuditLog from '../models/AuditLog.js';

/**
 * Audit Log Service - IMMUTABLE LOGS
 * 
 * Audit logs are permanent, read-only records for compliance and security.
 * Only CREATE and READ operations are allowed.
 * NO UPDATE or DELETE operations permitted.
 */

// Helper to validate and normalize userType
const validateUserType = (userType) => {
  const normalizedType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
  const validTypes = ['Customer', 'Admin'];
  if (!validTypes.includes(normalizedType)) {
    throw new Error(`Invalid user type: ${userType}`);
  }
  return normalizedType;
};

// Create an audit log (ONLY way to add audit logs)
export const createAuditLog = async ({
  userId,
  userType,
  action,
  resource,
  resourceId,
  changes = {},
  endpoint,
  method,
  ipAddress = 'Unknown',
  geolocation,
  status = 'success'
}) => {
  const normalizedUserType = validateUserType(userType);

  try {
    const log = await AuditLog.create({
      userId, userType: normalizedUserType, action, resource, resourceId, changes, endpoint, method, ipAddress, geolocation, status
    });
    return log;
  } catch (error) {
    throw new Error(`Failed to create audit log: ${error.message}`);
  }
};

// Get Audit Logs (READ-ONLY)
export const getAuditLogs = async (filters = {}, pagination = { page: 1, limit: 20 }) => {
  const skip = (pagination.page - 1) * pagination.limit;

  try {
    const logs = await AuditLog.find(filters)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pagination.limit);
    return logs;
  } catch (error) {
    throw new Error(`Failed to fetch audit logs: ${error.message}`);
  }
};

// Get Audit Statistics (READ-ONLY)
export const getAuditStats = async (dateRange = {}) => {
  try {
    const { startDate, endDate } = dateRange;
    const query = {};

    // Apply date filtering if provided
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Get total count
    const totalLogs = await AuditLog.countDocuments(query);

    // Count by action type
    const actionCounts = await AuditLog.aggregate([
      { $match: query },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Count by user type
    const userTypeCounts = await AuditLog.aggregate([
      { $match: query },
      { $group: { _id: '$userType', count: { $sum: 1 } } }
    ]);

    // Count by status
    const statusCounts = await AuditLog.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return {
      totalLogs,
      byAction: actionCounts,
      byUserType: userTypeCounts,
      byStatus: statusCounts
    };
  } catch (error) {
    throw new Error(`Failed to get audit stats: ${error.message}`);
  }
};
