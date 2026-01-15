import express from 'express';
// import urlRoutes from './routes/urlRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Trust proxy (required for correct IP behind load balancers/Render/Heroku/etc)
app.set('trust proxy', true);

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

// Centralized Error Handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;