import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
// import urlRoutes from './routes/urlRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitize from 'mongo-sanitize';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  formatErrorResponse,
  sanitizeErrorForLogging,
  isProduction,
  isOperationalError
} from './utils/errorUtils.js';

const app = express();

// =============================================================================
// TRUST PROXY CONFIGURATION (CRITICAL FOR PRODUCTION)
// =============================================================================
// When behind reverse proxies (Render, Heroku, Nginx, Cloudflare), Express must
// trust the X-Forwarded-For header to correctly identify client IPs.
// Without this, all requests appear to come from the proxy's IP, which:
// 1. Breaks rate limiting (everyone gets blocked or no one does)
// 2. Breaks IP-based security measures
// 3. Makes audit logs and geo-blocking useless
// Setting 'true' trusts the first proxy in the chain
app.set('trust proxy', true);

// Security headers (Helmet 8.1.0 - no known vulnerabilities)
// Configure CSP to allow Cloudinary images
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
}));

/*
// Force HTTPS in production
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
*/

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle JSON parsing errors (malformed request body)
// Must be after express.json() to catch SyntaxError from body-parser
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body'
    });
  }
  next(err);
});

// Sanitize data to prevent NoSQL injection (Express 5 compatible)
// Note: In Express 5, req.query and req.params are read-only getters
// We only sanitize req.body here. Query/params are validated in controllers.
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = mongoSanitize(req.body);
  }
  next();
});

// Static file serving
const serveLocalUploads = (process.env.SERVE_LOCAL_UPLOADS ?? 'true') === 'true';
if (serveLocalUploads) {
  app.use('/uploads', express.static('uploads'));
}

// Routes
app.use('/api/customers', customerRoutes); // customer-specific
app.use('/api/auth', authRoutes);          // common auth (refresh, logout, etc.)
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/notifications', notificationRoutes);
//app.use('/api/urls', urlRoutes);

// 404 handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// =============================================================================
// PRODUCTION: Serve Frontend (Same-Origin Deployment)
// =============================================================================
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');

  // Serve static files from frontend build
  app.use(express.static(frontendPath));

  // Handle React Router (SPA) - serve index.html for all non-API routes
  // Express 5 requires named parameter for wildcards: {*path} instead of *
  app.get('{*path}', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Centralized Error Handling middleware
// Catches all errors and returns safe responses
app.use((err, req, res, next) => {
  // Log error details for debugging (server-side only)
  const logEntry = sanitizeErrorForLogging(err, req);

  // In production, use structured logging; in dev, show full details
  if (isProduction()) {
    // Production: log structured entry without exposing to client
    console.error('[ERROR]', JSON.stringify(logEntry));
  } else {
    // Development: show full error for debugging
    console.error('[ERROR]', err);
  }

  // Log non-operational errors with higher severity (potential bugs)
  if (!isOperationalError(err)) {
    console.error('[CRITICAL] Non-operational error detected:', err.stack || err);
  }

  // Get safe response based on error type and environment
  const { statusCode, response } = formatErrorResponse(err);

  // Prevent sending response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json(response);
});

export default app;