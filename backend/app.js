import express from 'express';
// import urlRoutes from './routes/urlRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
//import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/customers', customerRoutes);
//app.use('/api/admins', adminRoutes);
//app.use('/api/urls', urlRoutes);

// Centralized Error Handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;