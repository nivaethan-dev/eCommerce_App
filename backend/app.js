import express from 'express';
// import urlRoutes from './routes/urlRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Centralized Error Handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api/customers', customerRoutes); // customer-specific
app.use('/api/auth', authRoutes);          // common auth (refresh, logout, etc.)
app.use('/api/admins', adminRoutes);
//app.use('/api/urls', urlRoutes);

export default app;