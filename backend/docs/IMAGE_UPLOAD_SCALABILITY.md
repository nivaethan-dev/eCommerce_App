# Image Upload Scalability Guide

## Current Implementation
The current system is designed to handle **single image uploads** per product for simplicity.

### Image Processing Features
- **Automatic resizing** to 800x600 pixels (16:9 aspect ratio)
- **Format standardization** - all images converted to JPEG
- **Quality optimization** - 85% quality for optimal file size vs quality balance
- **Metadata stripping** - removes EXIF data to reduce file size
- **Progressive JPEG** - enables better loading experience
- **Smart cropping** - maintains aspect ratio with center-focused cropping

## Configuration
All upload limits are centralized in `/backend/middleware/uploadMiddleware.js`:

```javascript
const UPLOAD_CONFIG = {
  MAX_IMAGES: 1,                    // Currently set to 1
  MAX_FILE_SIZE: 5 * 1024 * 1024,   // 5MB per image
  MIME_TYPES: { /* allowed types */ },
  IMAGE_RESIZE: {
    WIDTH: 800,                     // Target width
    HEIGHT: 600,                    // Target height
    QUALITY: 85,                    // JPEG quality (1-100)
    OUTPUT_FORMAT: 'jpeg',          // Output format
    PROGRESSIVE: true,              // Progressive JPEG
    STRIP_METADATA: true            // Remove EXIF data
  }
};
```

## To Extend for Multiple Images

### 1. Update Configuration
In `uploadMiddleware.js`, change:
```javascript
MAX_IMAGES: 5,  // or desired number
```

### 2. Update Product Model
In `Product.js`, change the image field:
```javascript
// From:
image: { type: String, required: true, ... }

// To:
images: [{ 
  type: String, 
  required: true, 
  validate: { /* same validation */ }
}]
```

### 3. Update Service Layer
In `productService.js`, update the `createProduct` method to handle multiple files:
```javascript
// Change from:
const product = await Product.create({
  // ... other fields
  image: imagePath,
});

// To:
const product = await Product.create({
  // ... other fields
  images: imagePaths, // array of paths
});
```

### 4. Update Routes
In `productRoutes.js`, change the upload middleware:
```javascript
// From:
uploadProductImage,  // single file

// To:
createUploadMiddleware('images', 5),  // multiple files
```

### 5. Image Processing
The `processImage` middleware automatically handles resizing for both single and multiple images:
- Each uploaded image is resized to the configured dimensions
- All images are converted to the same format
- Original files are automatically cleaned up

### 6. Update Validation
The `validateImage` function will automatically handle multiple files when `req.files` is used instead of `req.file`.

## Benefits of Current Design
- **Simple**: Easy to understand and maintain
- **Scalable**: Clear path to extend for multiple images
- **Configurable**: All limits in one place
- **Safe**: Proper validation and cleanup on errors
- **Future-proof**: Helper functions already provided

## Migration Strategy
1. Test current single-image functionality
2. Update configuration to allow multiple images
3. Update database schema (consider migration script)
4. Update frontend to handle multiple images
5. Test thoroughly before deployment
