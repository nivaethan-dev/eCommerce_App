import rateLimit from 'express-rate-limit';

// Rate limiting configuration for file uploads
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 upload requests per windowMs
  message: {
    success: false,
    error: 'Too many upload attempts. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many upload attempts. Please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Stricter rate limiting for admin uploads
const adminUploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 upload requests per hour
  message: {
    success: false,
    error: 'Admin upload limit exceeded. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Admin upload limit exceeded. Please try again later.',
      retryAfter: '1 hour'
    });
  }
});

// File size rate limiting (per IP per hour)
const fileSizeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100 * 1024 * 1024, // 100MB total upload size per hour per IP
  message: {
    success: false,
    error: 'File size limit exceeded for this hour. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'File size limit exceeded for this hour. Please try again later.',
      retryAfter: '1 hour'
    });
  }
});

export { uploadRateLimit, adminUploadRateLimit, fileSizeRateLimit };
