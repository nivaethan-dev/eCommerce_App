import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { dirname } from 'path';
import fs from 'fs/promises';
// Middleware to validate file mime type using file-type package
import { fileTypeFromFile } from 'file-type';
// Image processing library for resizing
import sharp from 'sharp';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const uploadDirectory = path.join(currentDirPath, '..', 'uploads', 'products');

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

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Store in uploads directory using ES modules compatible path
  },
  filename: function (req, file, cb) {
    // Generate random filename with product_ prefix
    const randomName = crypto.randomBytes(16).toString('hex');
    // Use original file extension for temporary storage, will be converted during processing
    const extension = MIME_TYPES[file.mimetype] || 'jpg';
    cb(null, `temp_${randomName}.${extension}`);
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
    fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
    files: UPLOAD_CONFIG.MAX_IMAGES // Limit to single image
  }
});

export const validateImage = async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'NO_FILE_PROVIDED',
        message: 'No image file provided',
        details: {
          maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
          maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
          allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
        }
      },
      timestamp: new Date().toISOString()
    });
  }

  // Additional validation: ensure only one image is uploaded
  // This is a safety check in case multer configuration doesn't work as expected
  if (req.files && req.files.length > UPLOAD_CONFIG.MAX_IMAGES) {
    // Clean up any uploaded files
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
    }
    return res.status(400).json({
      success: false,
      error: {
        code: 'TOO_MANY_FILES',
        message: `Only ${UPLOAD_CONFIG.MAX_IMAGES} image${UPLOAD_CONFIG.MAX_IMAGES > 1 ? 's' : ''} allowed per product`,
        details: {
          maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
          maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
          allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
        }
      },
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Detect actual file type
    const fileType = await fileTypeFromFile(req.file.path);

    // Validate against allowed MIME types
    if (!fileType || !Object.values(MIME_TYPES).includes(fileType.ext)) {
        // Delete fake/invalid file
        await fs.unlink(req.file.path);
        return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_FILE_TYPE',
              message: 'Invalid file type detected. Only JPG, JPEG, PNG, WEBP, and AVIF are allowed.',
              details: {
                maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
                maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
                allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
              }
            },
            timestamp: new Date().toISOString()
        });
    }
    next();
  } catch (err) {
    // Catch unexpected errors and clean up
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting invalid file:', unlinkError);
      }
    }

    return res.status(400).json({
      success: false,
      error: {
        code: 'FILE_PROCESSING_ERROR',
        message: 'Invalid file format or corrupted file',
        details: {
          maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
          maxFiles: UPLOAD_CONFIG.MAX_IMAGES,
          allowedTypes: Object.keys(UPLOAD_CONFIG.MIME_TYPES)
        }
      },
      timestamp: new Date().toISOString()
    });
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
    const { path: inputPath, filename } = req.file;
    // Generate final filename with correct extension
    const finalFilename = filename.replace('temp_', 'product_').replace(/\.[^.]+$/, `.${UPLOAD_CONFIG.IMAGE_RESIZE.OUTPUT_FORMAT}`);
    const outputPath = path.join(uploadDirectory, finalFilename);
    
    console.log('Processing image:', {
      inputPath,
      outputPath,
      originalFilename: filename,
      finalFilename,
      mimetype: req.file.mimetype
    });
    
    // Check if input file exists and get file stats
    let fileStats;
    try {
      fileStats = await fs.stat(inputPath);
      console.log('File stats:', {
        size: fileStats.size,
        isFile: fileStats.isFile(),
        mtime: fileStats.mtime
      });
    } catch (accessError) {
      throw new Error(`Input file does not exist: ${inputPath}`);
    }
    
    // Check if file is not empty
    if (fileStats.size === 0) {
      throw new Error('Input file is empty');
    }
    
    // Process image with Sharp - read from input and write to output
    const processedBuffer = await sharp(inputPath)
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
    
    // Write the processed buffer to the output file
    await fs.writeFile(outputPath, processedBuffer);
    
    console.log('Image processed successfully:', {
      outputPath,
      processedSize: processedBuffer.length,
      originalSize: fileStats.size
    });

    // Delete the original file
    await fs.unlink(inputPath);
    
    // Update the file path in req.file to point to the processed image
    req.file.path = outputPath;
    req.file.mimetype = `image/${UPLOAD_CONFIG.IMAGE_RESIZE.OUTPUT_FORMAT}`;
    req.file.filename = finalFilename;

    next();
  } catch (error) {
    // Log detailed error information for debugging
    console.error('Image processing error:', {
      message: error.message,
      stack: error.stack,
      inputPath: req.file?.path,
      filename: req.file?.filename,
      mimetype: req.file?.mimetype
    });

    // Clean up files on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file after processing error:', unlinkError);
      }
    }

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

// Export configuration for use in other parts of the application
export { UPLOAD_CONFIG };

// Future scalability: Function to create upload middleware for multiple images
// This can be used when we want to extend to multiple images in the future
export const createUploadMiddleware = (fieldName = 'image', maxImages = UPLOAD_CONFIG.MAX_IMAGES) => {
  const uploadConfig = {
    ...upload,
    limits: {
      ...upload.limits,
      files: maxImages
    }
  };
  
  if (maxImages === 1) {
    return uploadConfig.single(fieldName);
  } else {
    return uploadConfig.array(fieldName, maxImages);
  }
};