import express from 'express';
// import urlRoutes from './routes/urlRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/customers', customerRoutes); // customer-specific
app.use('/api/auth', authRoutes);          // common auth (refresh, logout, etc.)
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/security', securityRoutes);  // security dashboard and monitoring
//app.use('/api/urls', urlRoutes);

// Centralized Error Handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;