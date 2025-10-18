import { getSecurityStats, cleanOldLogs } from '../utils/securityMonitor.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const quarantineDirectory = path.join(currentDirPath, '..', 'uploads', 'quarantine');

// Get security dashboard data
export const getSecurityDashboard = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const stats = await getSecurityStats(hours);
    
    // Get quarantine directory info
    let quarantineInfo = { count: 0, totalSize: 0 };
    try {
      const files = await fs.readdir(quarantineDirectory);
      quarantineInfo.count = files.length;
      
      // Calculate total size of quarantined files
      for (const file of files) {
        try {
          const filePath = path.join(quarantineDirectory, file);
          const stats = await fs.stat(filePath);
          quarantineInfo.totalSize += stats.size;
        } catch (error) {
          // Skip files that can't be stat'd
        }
      }
    } catch (error) {
      // Quarantine directory doesn't exist or can't be read
    }
    
    res.json({
      success: true,
      data: {
        securityStats: stats,
        quarantineInfo,
        timeRange: `${hours} hours`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting security dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve security dashboard data'
    });
  }
};

// Get quarantined files list
export const getQuarantinedFiles = async (req, res) => {
  try {
    const files = await fs.readdir(quarantineDirectory);
    const fileDetails = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(quarantineDirectory, file);
        const stats = await fs.stat(filePath);
        fileDetails.push({
          name: file,
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        });
      } catch (error) {
        // Skip files that can't be stat'd
        fileDetails.push({
          name: file,
          error: 'Could not read file details'
        });
      }
    }
    
    // Sort by creation time (newest first)
    fileDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      data: {
        files: fileDetails,
        count: fileDetails.length
      }
    });
  } catch (error) {
    console.error('Error getting quarantined files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quarantined files'
    });
  }
};

// Clean old security logs
export const cleanSecurityLogs = async (req, res) => {
  try {
    await cleanOldLogs();
    res.json({
      success: true,
      message: 'Security logs cleaned successfully'
    });
  } catch (error) {
    console.error('Error cleaning security logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clean security logs'
    });
  }
};

// Delete quarantined file
export const deleteQuarantinedFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }
    
    const filePath = path.join(quarantineDirectory, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    
    // Delete the file
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'Quarantined file deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quarantined file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete quarantined file'
    });
  }
};
