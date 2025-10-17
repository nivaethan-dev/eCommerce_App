import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { dirname } from 'path';

// ES Module fix for __dirname
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const uploadDirectory = path.join(currentDirPath, '..', 'uploads');

// Allowed image types
const MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif'
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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware to validate file mime type using file-type package
import { fileTypeFromFile } from 'file-type';

export const validateImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'No image file provided' 
    });
  }

  try {
    const fileType = await fileTypeFromFile(req.file.path);
    
    // Verify if the file type matches the allowed MIME types
    if (!fileType || !MIME_TYPES[`image/${fileType.ext}`]) {
      // Remove the invalid file
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Invalid file type detected'
      });
    }
    
    next();
  } catch (error) {
    // Clean up uploaded file if validation fails
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error('Error deleting invalid file:', unlinkError);
    }
    
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid file format' 
    });
  }
};

export const uploadProductImage = upload.single('image');