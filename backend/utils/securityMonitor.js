import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const securityLogPath = path.join(currentDirPath, '..', 'logs', 'security.log');

// Ensure logs directory exists
const ensureLogsDirectory = async () => {
  const logsDir = path.dirname(securityLogPath);
  try {
    await fs.access(logsDir);
  } catch {
    await fs.mkdir(logsDir, { recursive: true });
  }
};

// Security event types
export const SECURITY_EVENTS = {
  SUSPICIOUS_FILE: 'SUSPICIOUS_FILE',
  QUARANTINED_FILE: 'QUARANTINED_FILE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
  PROCESSING_ERROR: 'PROCESSING_ERROR'
};

// Log security events
export const logSecurityEvent = async (eventType, details) => {
  try {
    await ensureLogsDirectory();
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown',
      userId: details.userId || 'anonymous'
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    await fs.appendFile(securityLogPath, logLine);
    
    // Also log to console for immediate visibility
    console.warn(`[SECURITY] ${eventType}:`, logEntry);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Get security statistics
export const getSecurityStats = async (hours = 24) => {
  try {
    await ensureLogsDirectory();
    
    const logContent = await fs.readFile(securityLogPath, 'utf8');
    const lines = logContent.trim().split('\n').filter(line => line);
    
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentEvents = lines
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(event => event && new Date(event.timestamp) > cutoffTime);
    
    const stats = {
      totalEvents: recentEvents.length,
      eventsByType: {},
      eventsByIP: {},
      eventsByUser: {},
      timeRange: `${hours} hours`
    };
    
    recentEvents.forEach(event => {
      // Count by event type
      stats.eventsByType[event.eventType] = (stats.eventsByType[event.eventType] || 0) + 1;
      
      // Count by IP
      stats.eventsByIP[event.ip] = (stats.eventsByIP[event.ip] || 0) + 1;
      
      // Count by user
      stats.eventsByUser[event.userId] = (stats.eventsByUser[event.userId] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Failed to get security stats:', error);
    return { error: 'Failed to retrieve security statistics' };
  }
};

// Clean old log entries (keep last 30 days)
export const cleanOldLogs = async () => {
  try {
    await ensureLogsDirectory();
    
    const logContent = await fs.readFile(securityLogPath, 'utf8');
    const lines = logContent.trim().split('\n').filter(line => line);
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentLines = lines.filter(line => {
      try {
        const event = JSON.parse(line);
        return new Date(event.timestamp) > thirtyDaysAgo;
      } catch {
        return true; // Keep malformed lines
      }
    });
    
    await fs.writeFile(securityLogPath, recentLines.join('\n') + '\n');
    console.log(`Cleaned security logs. Kept ${recentLines.length} recent entries.`);
  } catch (error) {
    console.error('Failed to clean old logs:', error);
  }
};
