import * as auditService from '../services/auditLogService.js';

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await auditService.getAuditLogs(req.query.filters || {}, req.query.pagination || {});
    res.json(logs);
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
    const stats = await auditService.getAuditStats(req.query.dateRange || {});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
