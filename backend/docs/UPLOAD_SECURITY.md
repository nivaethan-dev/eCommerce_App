# File Upload Security Enhancements

This document outlines the comprehensive security measures implemented for file uploads in the ecommerce application.

## Overview

The file upload system has been enhanced with multiple layers of security to protect against malicious files, prevent abuse, and maintain system integrity.

## Security Features Implemented

### 1. Multi-Layer File Validation

#### Magic Number Validation
- Uses the `file-type` package to detect actual file types by reading file headers
- Prevents file extension spoofing attacks
- Validates against a whitelist of allowed image types: JPG, JPEG, PNG, WEBP, AVIF

#### MIME Type Filtering
- Validates Content-Type headers against allowed MIME types
- Rejects files with suspicious or invalid MIME types

#### File Size Validation
- Minimum file size: 1KB (prevents empty files)
- Maximum file size: 5MB (prevents DoS attacks)
- Validates file size both at multer level and application level

### 2. Image Processing and Sanitization

#### Sharp Library Integration
- All uploaded images are processed using the Sharp library
- Converts all images to JPEG format for consistency and security
- Removes EXIF data to prevent privacy leaks and potential security issues
- Optimizes image quality (85% quality setting)
- Uses progressive JPEG encoding for better performance

#### Image Content Validation
- Validates image dimensions (100x100 to 4000x4000 pixels)
- Ensures uploaded files are actually valid images
- Prevents malformed or corrupted image files

### 3. Suspicious Content Detection

#### Pattern Matching
- Scans file content for suspicious patterns:
  - JavaScript code (`eval(`, `<script`, `javascript:`)
  - VBScript code (`vbscript:`)
  - Event handlers (`onload=`, `onerror=`)
- Quarantines files containing suspicious patterns

### 4. File Quarantine System

#### Automatic Quarantine
- Suspicious files are automatically moved to a quarantine directory
- Quarantined files are timestamped and logged
- Original filenames are preserved for investigation
- Quarantine directory: `uploads/quarantine/`

#### Quarantine Management
- Admin endpoints to view quarantined files
- Ability to delete quarantined files
- File metadata tracking (size, creation time, reason for quarantine)

### 5. Rate Limiting

#### Upload Rate Limits
- **General uploads**: 10 uploads per 15 minutes per IP
- **Admin uploads**: 50 uploads per hour per IP
- **File size limit**: 100MB total upload size per hour per IP
- Prevents abuse and DoS attacks

#### Implementation
- Uses `express-rate-limit` middleware
- Different limits for different user types
- Graceful error handling with retry information

### 6. Security Monitoring and Logging

#### Security Event Logging
- Comprehensive logging of all security events
- Log file: `logs/security.log`
- JSON format for easy parsing and analysis
- Event types tracked:
  - `SUSPICIOUS_FILE`: Files with suspicious content
  - `QUARANTINED_FILE`: Files moved to quarantine
  - `RATE_LIMIT_EXCEEDED`: Rate limit violations
  - `INVALID_FILE_TYPE`: Invalid file type attempts
  - `FILE_SIZE_EXCEEDED`: File size violations
  - `PROCESSING_ERROR`: Image processing failures

#### Security Dashboard
- Admin-only dashboard for monitoring security events
- Real-time statistics and analytics
- Quarantine file management
- Log cleanup utilities

### 7. Secure File Storage

#### Random Filename Generation
- Uses `crypto.randomBytes(16).toString('hex')` for secure filenames
- Prevents directory traversal attacks
- Prevents filename-based attacks
- Format: `product_[random_hex].[extension]`

#### Directory Structure
```
uploads/
├── products/          # Processed, safe images
└── quarantine/        # Suspicious files
logs/
└── security.log      # Security event logs
```

## API Endpoints

### Upload Endpoints
- `POST /api/products/create` - Create product with image upload
  - Requires admin authentication
  - Rate limited
  - Full security validation

### Security Management Endpoints (Admin Only)
- `GET /api/security/dashboard` - Security dashboard data
- `GET /api/security/quarantine` - List quarantined files
- `POST /api/security/logs/clean` - Clean old security logs
- `DELETE /api/security/quarantine/:filename` - Delete quarantined file

## Configuration

### Security Configuration
```javascript
const SECURITY_CONFIG = {
  // Image dimension limits
  MAX_WIDTH: 4000,
  MAX_HEIGHT: 4000,
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  
  // File size limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_FILE_SIZE: 1024, // 1KB
  
  // Image processing settings
  QUALITY: 85,
  FORMAT: 'jpeg',
  
  // Suspicious patterns
  SUSPICIOUS_PATTERNS: [
    /eval\s*\(/i,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i
  ]
};
```

## Security Benefits

### Protection Against:
1. **Malicious File Uploads**: Multi-layer validation prevents executable files
2. **File Extension Spoofing**: Magic number validation detects real file types
3. **DoS Attacks**: Rate limiting and file size restrictions
4. **Privacy Leaks**: EXIF data removal
5. **Code Injection**: Suspicious content pattern detection
6. **Directory Traversal**: Secure filename generation
7. **Resource Exhaustion**: File size and rate limits

### Monitoring and Response:
1. **Real-time Monitoring**: Security dashboard for admins
2. **Incident Response**: Automatic quarantine of suspicious files
3. **Audit Trail**: Comprehensive logging of all security events
4. **Forensic Analysis**: Preserved quarantined files for investigation

## Best Practices

### For Administrators:
1. Regularly review security dashboard
2. Investigate quarantined files
3. Clean old security logs periodically
4. Monitor rate limit violations
5. Review suspicious upload patterns

### For Developers:
1. All file uploads go through the security middleware
2. Never bypass security validation
3. Test with various file types and sizes
4. Monitor security logs for patterns
5. Update suspicious patterns as needed

## Dependencies Added

- `sharp`: Image processing and sanitization
- `express-rate-limit`: Rate limiting (already existed)

## File Structure

```
backend/
├── middleware/
│   ├── uploadMiddleware.js      # Enhanced upload security
│   └── uploadRateLimit.js       # Rate limiting configuration
├── utils/
│   └── securityMonitor.js       # Security logging and monitoring
├── controllers/
│   └── securityController.js    # Security dashboard endpoints
├── routes/
│   └── securityRoutes.js        # Security API routes
├── test/
│   └── uploadSecurity.test.js   # Security tests
└── docs/
    └── UPLOAD_SECURITY.md       # This documentation
```

## Testing

Run the security tests:
```bash
npm test uploadSecurity.test.js
```

## Maintenance

### Regular Tasks:
1. Review security logs weekly
2. Clean old logs monthly
3. Investigate quarantined files
4. Update suspicious patterns as needed
5. Monitor system performance impact

### Log Rotation:
- Security logs are automatically cleaned after 30 days
- Manual cleanup available via API endpoint
- Quarantined files should be reviewed and cleaned periodically

This comprehensive security implementation provides robust protection against malicious file uploads while maintaining usability and performance.
