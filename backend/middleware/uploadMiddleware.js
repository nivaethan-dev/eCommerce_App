import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { dirname } from 'path';
import fs from 'fs/promises';
// Middleware to validate file mime type using file-type package
import { fileTypeFromFile } from 'file-type';
import sharp from 'sharp';
import { logSecurityEvent, SECURITY_EVENTS } from '../utils/securityMonitor.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const uploadDirectory = path.join(currentDirPath, '..', 'uploads', 'products');
const quarantineDirectory = path.join(currentDirPath, '..', 'uploads', 'quarantine');

// Allowed image types
const MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif'
};

// Security configuration
const SECURITY_CONFIG = {
  // Image dimension limits
  MAX_WIDTH: 4000,
  MAX_HEIGHT: 4000,
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  
  // File size limits (in bytes)
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_FILE_SIZE: 1024, // 1KB
  
  // Image processing settings
  QUALITY: 85,
  FORMAT: 'jpeg', // Convert all images to JPEG for consistency and security
  
  // Suspicious file patterns (basic heuristics)
  SUSPICIOUS_PATTERNS: [
    /eval\s*\(/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i
  ]
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Store in uploads directory using ES modules compatible path
  },
  filename: function (req, file, cb) {
    // Generate random filename with product_ prefix
    const randomName = crypto.randomBytes(16).toString('hex');
    const extension = MIME_TYPES[file.mimetype];
    cb(null, `product_${randomName}.${extension}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file type is allowed
  if (MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, WEBP, and AVIF files are allowed.'), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: SECURITY_CONFIG.MAX_FILE_SIZE,
    files: 1, // Only allow one file per upload
    fieldSize: 1024 * 1024, // 1MB limit for form fields
  }
});

// Helper function to create quarantine directory if it doesn't exist
const ensureQuarantineDirectory = async () => {
  try {
    await fs.access(quarantineDirectory);
  } catch {
    await fs.mkdir(quarantineDirectory, { recursive: true });
  }
};

// Helper function to move file to quarantine
const quarantineFile = async (filePath, reason, req = null) => {
  await ensureQuarantineDirectory();
  const fileName = path.basename(filePath);
  const quarantinePath = path.join(quarantineDirectory, `${Date.now()}_${fileName}`);
  await fs.rename(filePath, quarantinePath);
  
  // Log security event
  await logSecurityEvent(SECURITY_EVENTS.QUARANTINED_FILE, {
    fileName,
    reason,
    ip: req?.ip || req?.connection?.remoteAddress || 'unknown',
    userAgent: req?.get('User-Agent') || 'unknown',
    userId: req?.user?.id || 'anonymous'
  });
  
  console.warn(`File quarantined: ${fileName}, Reason: ${reason}`);
  return quarantinePath;
};

// Helper function to scan file content for suspicious patterns
const scanForSuspiciousContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        return `Suspicious pattern detected: ${pattern.source}`;
      }
    }
    return null;
  } catch (error) {
    // If we can't read as text, it might be binary - that's okay for images
    return null;
  }
};

// Helper function to process and sanitize image
const processImage = async (inputPath, outputPath) => {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Validate image dimensions
    if (metadata.width < SECURITY_CONFIG.MIN_WIDTH || metadata.width > SECURITY_CONFIG.MAX_WIDTH ||
        metadata.height < SECURITY_CONFIG.MIN_HEIGHT || metadata.height > SECURITY_CONFIG.MAX_HEIGHT) {
      throw new Error(`Invalid image dimensions: ${metadata.width}x${metadata.height}. Must be between ${SECURITY_CONFIG.MIN_WIDTH}x${SECURITY_CONFIG.MIN_HEIGHT} and ${SECURITY_CONFIG.MAX_WIDTH}x${SECURITY_CONFIG.MAX_HEIGHT}`);
    }
    
    // Process image: remove EXIF data, convert to JPEG, optimize quality
    await image
      .jpeg({ 
        quality: SECURITY_CONFIG.QUALITY,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath);
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size
    };
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

export const validateImage = async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    });
  }

  const originalPath = req.file.path;
  let processedPath = null;

  try {
    // Step 1: Basic file type validation using magic numbers
    const fileType = await fileTypeFromFile(originalPath);
    
    if (!fileType || !Object.values(MIME_TYPES).includes(fileType.ext)) {
      await logSecurityEvent(SECURITY_EVENTS.INVALID_FILE_TYPE, {
        fileName: path.basename(originalPath),
        detectedType: fileType?.ext || 'unknown',
        ip: req.ip || req.connection?.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        userId: req.user?.id || 'anonymous'
      });
      
      await quarantineFile(originalPath, 'Invalid file type detected', req);
      return res.status(400).json({
        success: false,
        error: 'Invalid file type detected. Only JPG, JPEG, PNG, WEBP, and AVIF are allowed.'
      });
    }

    // Step 2: File size validation
    const stats = await fs.stat(originalPath);
    if (stats.size < SECURITY_CONFIG.MIN_FILE_SIZE || stats.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
      await logSecurityEvent(SECURITY_EVENTS.FILE_SIZE_EXCEEDED, {
        fileName: path.basename(originalPath),
        fileSize: stats.size,
        ip: req.ip || req.connection?.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        userId: req.user?.id || 'anonymous'
      });
      
      await quarantineFile(originalPath, `Invalid file size: ${stats.size} bytes`, req);
      return res.status(400).json({
        success: false,
        error: `File size must be between ${SECURITY_CONFIG.MIN_FILE_SIZE} and ${SECURITY_CONFIG.MAX_FILE_SIZE} bytes`
      });
    }

    // Step 3: Scan for suspicious content patterns
    const suspiciousReason = await scanForSuspiciousContent(originalPath);
    if (suspiciousReason) {
      await logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_FILE, {
        fileName: path.basename(originalPath),
        reason: suspiciousReason,
        ip: req.ip || req.connection?.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        userId: req.user?.id || 'anonymous'
      });
      
      await quarantineFile(originalPath, suspiciousReason, req);
      return res.status(400).json({
        success: false,
        error: 'File contains suspicious content and has been quarantined'
      });
    }

    // Step 4: Process and sanitize the image
    const processedFileName = `processed_${req.file.filename}`;
    processedPath = path.join(uploadDirectory, processedFileName);
    
    const imageInfo = await processImage(originalPath, processedPath);
    
    // Step 5: Clean up original file and update request
    await fs.unlink(originalPath);
    req.file.path = processedPath;
    req.file.filename = processedFileName;
    req.file.size = imageInfo.size;
    req.file.processedImageInfo = imageInfo;

    next();
  } catch (err) {
    // Clean up files on error
    if (originalPath) {
      try {
        await fs.unlink(originalPath);
      } catch (unlinkError) {
        console.error('Error deleting original file:', unlinkError);
      }
    }
    
    if (processedPath) {
      try {
        await fs.unlink(processedPath);
      } catch (unlinkError) {
        console.error('Error deleting processed file:', unlinkError);
      }
    }

    // If it's a validation error, quarantine the file
    if (err.message.includes('Invalid') || err.message.includes('Image processing failed')) {
      try {
        await logSecurityEvent(SECURITY_EVENTS.PROCESSING_ERROR, {
          fileName: path.basename(originalPath),
          error: err.message,
          ip: req.ip || req.connection?.remoteAddress || 'unknown',
          userAgent: req.get('User-Agent') || 'unknown',
          userId: req.user?.id || 'anonymous'
        });
        
        await quarantineFile(originalPath, err.message, req);
      } catch (quarantineError) {
        console.error('Error quarantining file:', quarantineError);
      }
    }

    return res.status(400).json({
      success: false,
      error: err.message || 'Invalid file format or corrupted file'
    });
  }
};

export const uploadProductImage = upload.single('image');