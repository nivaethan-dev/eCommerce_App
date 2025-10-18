# 🔧 Image Upload Technical Implementation Guide

## Code Architecture

### 1. Middleware Stack
```javascript
// Route definition with middleware chain
router.post('/create',
  authMiddleware,        // 1. JWT authentication
  roleMiddleware('admin'), // 2. Admin role check
  uploadProductImage,    // 3. File upload (Multer)
  handleUploadError,     // 4. Upload error handling
  processImage,          // 5. Image processing (Sharp)
  validateImage,         // 6. File validation
  createProduct          // 7. Database operation
);
```

### 2. Core Configuration
```javascript
// Centralized configuration object
const UPLOAD_CONFIG = {
  // File limits
  MAX_IMAGES: 1,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Allowed MIME types
  MIME_TYPES: {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
  },
  
  // Image processing settings
  IMAGE_RESIZE: {
    WIDTH: 800,
    HEIGHT: 600,
    QUALITY: 85,
    OUTPUT_FORMAT: 'jpeg',
    PROGRESSIVE: true,
    STRIP_METADATA: true
  }
};
```

---

## File Upload Implementation

### Multer Configuration
```javascript
// Disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // 'uploads/products/'
  },
  filename: function (req, file, cb) {
    const randomName = crypto.randomBytes(16).toString('hex');
    const extension = MIME_TYPES[file.mimetype] || 'jpg';
    cb(null, `temp_${randomName}.${extension}`);
  }
});

// Multer instance with limits and filters
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
    files: UPLOAD_CONFIG.MAX_IMAGES
  }
});
```

### File Filter Function
```javascript
const fileFilter = (req, file, cb) => {
  if (MIME_TYPES[file.mimetype]) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type'), false); // Reject file
  }
};
```

---

## Image Processing Implementation

### Sharp Processing Pipeline
```javascript
export const processImage = async (req, res, next) => {
  try {
    const { path: inputPath, filename } = req.file;
    const finalFilename = filename.replace('temp_', 'product_')
      .replace(/\.[^.]+$/, `.${UPLOAD_CONFIG.IMAGE_RESIZE.OUTPUT_FORMAT}`);
    const outputPath = path.join(uploadDirectory, finalFilename);
    
    // File validation
    const fileStats = await fs.stat(inputPath);
    if (fileStats.size === 0) {
      throw new Error('Input file is empty');
    }
    
    // Image processing with Sharp
    const processedBuffer = await sharp(inputPath)
      .resize(UPLOAD_CONFIG.IMAGE_RESIZE.WIDTH, UPLOAD_CONFIG.IMAGE_RESIZE.HEIGHT, {
        fit: 'cover',        // Smart cropping
        position: 'center'   // Center-focused crop
      })
      .jpeg({
        quality: UPLOAD_CONFIG.IMAGE_RESIZE.QUALITY,
        progressive: UPLOAD_CONFIG.IMAGE_RESIZE.PROGRESSIVE
      })
      .withMetadata(!UPLOAD_CONFIG.IMAGE_RESIZE.STRIP_METADATA)
      .toBuffer();
    
    // Save processed image
    await fs.writeFile(outputPath, processedBuffer);
    
    // Cleanup and update request
    await fs.unlink(inputPath);
    req.file.path = outputPath;
    req.file.mimetype = `image/${UPLOAD_CONFIG.IMAGE_RESIZE.OUTPUT_FORMAT}`;
    req.file.filename = finalFilename;
    
    next();
  } catch (error) {
    // Error handling with cleanup
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'IMAGE_PROCESSING_ERROR',
        message: `Failed to process image: ${error.message}`,
        details: { /* error details */ }
      },
      timestamp: new Date().toISOString()
    });
  }
};
```

---

## Validation Implementation

### File Type Validation
```javascript
export const validateImage = async (req, res, next) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'NO_FILE_PROVIDED',
        message: 'No image file provided',
        details: { /* validation details */ }
      }
    });
  }
  
  // Check for multiple files (safety check)
  if (req.files && req.files.length > UPLOAD_CONFIG.MAX_IMAGES) {
    // Cleanup multiple files
    for (const file of req.files) {
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    return res.status(400).json({
      success: false,
      error: {
        code: 'TOO_MANY_FILES',
        message: `Only ${UPLOAD_CONFIG.MAX_IMAGES} image allowed`,
        details: { /* error details */ }
      }
    });
  }
  
  try {
    // File signature validation
    const fileType = await fileTypeFromFile(req.file.path);
    
    if (!fileType || !Object.values(MIME_TYPES).includes(fileType.ext)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'Invalid file type detected',
          details: { /* error details */ }
        }
      });
    }
    
    next();
  } catch (err) {
    // Error handling
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    return res.status(400).json({
      success: false,
      error: {
        code: 'FILE_PROCESSING_ERROR',
        message: 'Invalid file format or corrupted file',
        details: { /* error details */ }
      }
    });
  }
};
```

---

## Error Handling Implementation

### Multer Error Handler
```javascript
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    let statusCode = 400;
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = `File too large. Maximum size allowed is ${Math.round(UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024))}MB`;
        break;
      case 'LIMIT_FILE_COUNT':
        message = `Too many files. Only ${UPLOAD_CONFIG.MAX_IMAGES} image allowed`;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected field name. Use "image" as the field name';
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
        details: { /* error details */ }
      },
      timestamp: new Date().toISOString()
    });
  }
  
  next(error);
};
```

---

## Database Integration

### Product Model Schema
```javascript
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  // Single image field with validation
  image: {
    type: String,
    required: [true, 'Product image is required'],
    validate: {
      validator: function(value) {
        return value.startsWith('uploads/products/product_');
      },
      message: 'Invalid image path format'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be a whole number'
    }
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

### Product Service Implementation
```javascript
export class ProductService {
  static async createProduct(productData, file) {
    const { title, description, stock, category, price } = productData;
    
    // Validation
    if (!file) {
      throw new Error('Product image is required');
    }
    
    // Parse and validate numeric fields
    const parsedStock = parseInt(stock, 10);
    const parsedPrice = Number(parseFloat(price).toFixed(2));
    
    if (isNaN(parsedStock) || parsedStock < 0) {
      throw new Error('Stock must be a non-negative number');
    }
    
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error('Price must be a non-negative number');
    }
    
    // Create image path
    let imagePath = path.join('uploads', 'products', file.filename);
    imagePath = imagePath.replace(/\\/g, '/');
    
    // Create product
    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      image: imagePath,
      stock: parsedStock,
      category: category.trim(),
      price: parsedPrice
    });
    
    return product;
  }
}
```

---

## Security Implementation

### Authentication Middleware
```javascript
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Access token required' });
    }
    
    let decoded;
    let userRole;
    
    try {
      decoded = jwt.verify(token, process.env.CUSTOMER_JWT_SECRET);
      userRole = 'customer';
    } catch (err) {
      try {
        decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        userRole = 'admin';
      } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    }
    
    req.user = {
      id: decoded.id,
      role: userRole
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};
```

### Role Middleware
```javascript
export const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: `Access denied: ${requiredRole} role required`
      });
    }
    
    next();
  };
};
```

---

## File Management

### File Lifecycle
```javascript
// 1. Upload (Multer)
temp_[random].jpg → uploads/products/

// 2. Process (Sharp)
temp_[random].jpg → product_[random].jpg (800x600 JPEG)

// 3. Validate
Check file type, size, content

// 4. Store
Save path to database: 'uploads/products/product_[random].jpg'

// 5. Cleanup
Delete temp file
```

### File Naming Convention
```javascript
// Temporary file
const tempFilename = `temp_${crypto.randomBytes(16).toString('hex')}.${extension}`;

// Final file
const finalFilename = `product_${crypto.randomBytes(16).toString('hex')}.jpeg`;
```

---

## Performance Considerations

### Sharp Optimization
```javascript
// Optimized Sharp configuration
await sharp(inputPath)
  .resize(800, 600, {
    fit: 'cover',        // Smart cropping
    position: 'center'   // Center-focused
  })
  .jpeg({
    quality: 85,         // Optimal quality/size balance
    progressive: true    // Better loading experience
  })
  .withMetadata(false)  // Strip EXIF data
  .toBuffer();
```

### Memory Management
- Use `toBuffer()` instead of `toFile()` for better memory control
- Process images in chunks for large files
- Clean up temporary files immediately

---

## Testing Implementation

### Unit Tests
```javascript
// Test file upload
describe('Image Upload', () => {
  it('should upload valid image', async () => {
    const response = await request(app)
      .post('/api/products/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', 'test-image.jpg')
      .field('title', 'Test Product')
      .field('description', 'Test description')
      .field('price', 99.99)
      .field('stock', 10)
      .field('category', 'Electronics');
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### Integration Tests
```javascript
// Test complete flow
describe('Product Creation Flow', () => {
  it('should create product with processed image', async () => {
    // Test authentication
    // Test file upload
    // Test image processing
    // Test database storage
    // Test response format
  });
});
```

---

## Monitoring and Logging

### Error Logging
```javascript
console.error('Image processing error:', {
  message: error.message,
  stack: error.stack,
  inputPath: req.file?.path,
  filename: req.file?.filename,
  mimetype: req.file?.mimetype
});
```

### Success Logging
```javascript
console.log('Image processed successfully:', {
  outputPath,
  processedSize: processedBuffer.length,
  originalSize: fileStats.size
});
```

---

## Scalability Considerations

### Multiple Images Support
```javascript
// Future scalability function
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
```

### Performance Optimizations
- CDN integration for image serving
- Image variant generation (thumbnails)
- Lazy loading implementation
- Caching strategies

---

This technical implementation provides a complete, secure, and scalable image upload system for e-commerce applications.
