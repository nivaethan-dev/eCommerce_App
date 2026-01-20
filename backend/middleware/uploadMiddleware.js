import multer from 'multer';
import crypto from 'crypto';
// Middleware to validate file mime type using file-type package
import { fileTypeFromBuffer } from 'file-type';
// Image processing library for resizing
import sharp from 'sharp';

import { uploadImageBuffer } from '../utils/cloudinary.js';

// Configuration for image uploads - easily modifiable for future scalability
const UPLOAD_CONFIG = {
  // Maximum number of images allowed per product
  MAX_IMAGES: 1,
  // Maximum file size per image (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  // Allowed image types
  MIME_TYPES: {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
  },
  // Image resizing configuration for consistent dimensions
  IMAGE_RESIZE: {
    // Standard e-commerce product image dimensions (16:9 aspect ratio)
    WIDTH: 800,
    HEIGHT: 600,
    // Quality settings for optimal file size vs quality balance
    QUALITY: 85,
    // Format to convert all images to (for consistency)
    OUTPUT_FORMAT: 'jpeg',
    // Enable progressive JPEG for better loading experience
    PROGRESSIVE: true,
    // Strip metadata to reduce file size
    STRIP_METADATA: true
  }
};

// For backward compatibility, keep MIME_TYPES reference
const MIME_TYPES = UPLOAD_CONFIG.MIME_TYPES;

// Configure multer storage (memory only — no local disk writes)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file type is allowed (with type check to prevent type confusion attacks)
  if (typeof file.mimetype === 'string' && MIME_TYPES[file.mimetype]) {
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
    fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
    files: UPLOAD_CONFIG.MAX_IMAGES // Limit to single image
  }
});

// Helper retained for compatibility (no-op with memory storage)
const cleanupFiles = async () => {};

// Centralized error response formatter for image uploads
const sendUploadError = (res, code, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: {
        maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
        maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
        allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
      }
    },
    timestamp: new Date().toISOString()
  });
};

// Middleware to enforce that a file MUST be present (for Create)
export const requireImage = (req, res, next) => {
  if (!req.file) {
    return sendUploadError(res, 'NO_FILE_PROVIDED', 'Product image is required');
  }
  next();
};

export const validateImage = async (req, res, next) => {
  // If no file, just skip (logic for required vs optional is handled by requireImage)
  if (!req.file) return next();

  // Safety check: ensure only one image is uploaded (with Array.isArray to prevent type confusion)
  if (Array.isArray(req.files) && req.files.length > UPLOAD_CONFIG.MAX_IMAGES) {
    await cleanupFiles(req);
    return sendUploadError(res, 'TOO_MANY_FILES', `Only ${UPLOAD_CONFIG.MAX_IMAGES} images allowed`);
  }

  try {
    // Validate buffer type to prevent type confusion attacks
    if (!Buffer.isBuffer(req.file.buffer)) {
      await cleanupFiles(req);
      return sendUploadError(res, 'INVALID_FILE_DATA', 'Invalid file data received');
    }

    // Detect actual file type
    const fileType = await fileTypeFromBuffer(req.file.buffer);

    // Validate against allowed MIME types (with string type check to prevent type confusion)
    if (!fileType || typeof fileType.ext !== 'string' || !Object.values(MIME_TYPES).includes(fileType.ext)) {
      await cleanupFiles(req);
      return sendUploadError(res, 'INVALID_FILE_TYPE', 'Invalid file type detected. Only JPG, JPEG, PNG, WEBP, and AVIF are allowed.');
    }
    next();
  } catch (err) {
    await cleanupFiles(req);
    return sendUploadError(res, 'FILE_PROCESSING_ERROR', 'Invalid file format or corrupted file');
  }
};

export const uploadProductImage = upload.single('image');

// Image processing middleware - resizes images to consistent dimensions
export const processImage = async (req, res, next) => {
  // Skip if no file was uploaded
  if (!req.file) {
    return next();
  }

  try {
    const inputBuffer = req.file.buffer;

    // Validate buffer type and content to prevent type confusion attacks
    if (!Buffer.isBuffer(inputBuffer) || inputBuffer.length === 0) {
      throw new Error('Invalid or empty file buffer');
    }

    // Process image with Sharp - read from memory and output a buffer
    const processedBuffer = await sharp(inputBuffer)
      .resize(UPLOAD_CONFIG.IMAGE_RESIZE.WIDTH, UPLOAD_CONFIG.IMAGE_RESIZE.HEIGHT, {
        fit: 'cover', // Crop to fill dimensions while maintaining aspect ratio
        position: 'center' // Center the crop
      })
      .jpeg({
        quality: UPLOAD_CONFIG.IMAGE_RESIZE.QUALITY,
        progressive: UPLOAD_CONFIG.IMAGE_RESIZE.PROGRESSIVE
      })
      .withMetadata(!UPLOAD_CONFIG.IMAGE_RESIZE.STRIP_METADATA) // Strip metadata if configured
      .toBuffer();

    // Upload processed buffer to Cloudinary
    const randomName = crypto.randomBytes(16).toString('hex');
    const publicId = `product_${randomName}`;

    const uploaded = await uploadImageBuffer(processedBuffer, {
      public_id: publicId
    });

    // Attach Cloudinary results for downstream service layer
    req.file.cloudinaryUrl = uploaded.secure_url;
    req.file.cloudinaryPublicId = uploaded.public_id;

    // Keep metadata consistent for any other middleware that inspects req.file
    req.file.mimetype = `image/${UPLOAD_CONFIG.IMAGE_RESIZE.OUTPUT_FORMAT}`;
    req.file.filename = `${publicId}.jpg`;
    req.file.buffer = processedBuffer;

    next();
  } catch (error) {
    // Log detailed error information for debugging
    console.error('Image processing error:', {
      message: error.message,
      stack: error.stack,
      filename: req.file?.filename,
      mimetype: req.file?.mimetype
    });

    return res.status(400).json({
      success: false,
      error: {
        code: 'IMAGE_PROCESSING_ERROR',
        message: `Failed to process image: ${error.message}`,
        details: {
          maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
          maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
          allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES),
          targetDimensions: `${UPLOAD_CONFIG.IMAGE_RESIZE.WIDTH}x${UPLOAD_CONFIG.IMAGE_RESIZE.HEIGHT}`,
          originalError: error.message
        }
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Error handling middleware for multer errors
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    let statusCode = 400;

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = `File too large. Maximum size allowed is ${Math.round(UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024))}MB`;
        break;
      case 'LIMIT_FILE_COUNT':
        message = `Too many files. Only ${UPLOAD_CONFIG.MAX_IMAGES} image${UPLOAD_CONFIG.MAX_IMAGES > 1 ? 's' : ''} allowed`;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected field name. Use "image" as the field name for file upload';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts in the request';
        break;
      default:
        message = `Upload error: ${error.message}`;
    }

    return res.status(statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: message,
        details: {
          maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
          maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
          allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
        }
      },
      timestamp: new Date().toISOString()
    });
  }

  // Handle other errors
  if (error.message) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_VALIDATION_ERROR',
        message: error.message,
        details: {
          maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
          maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
          allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
        }
      },
      timestamp: new Date().toISOString()
    });
  }

  // Pass to next error handler
  next(error);
};

// Combined middleware for standard product image processing
// Note: handleUploadError should be called individually after multer if needed,
// or included here for maximum maintainability.
export const productUploadBundle = [
  uploadProductImage,
  handleUploadError,
  validateImage,
  processImage
];

// Export configuration for use in other parts of the application
export { UPLOAD_CONFIG };

// Future scalability: Function to create upload middleware for multiple images
// This can be used when we want to extend to multiple images in the future
export const createUploadMiddleware = (fieldName = 'image', maxImages = UPLOAD_CONFIG.MAX_IMAGES) => {
  // Validate parameters to prevent type confusion
  if (typeof fieldName !== 'string' || fieldName.length === 0) {
    throw new Error('fieldName must be a non-empty string');
  }
  if (typeof maxImages !== 'number' || maxImages < 1 || !Number.isInteger(maxImages)) {
    throw new Error('maxImages must be a positive integer');
  }

  const instance = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
      files: maxImages
    }
  });

  return maxImages === 1 ? instance.single(fieldName) : instance.array(fieldName, maxImages);
};