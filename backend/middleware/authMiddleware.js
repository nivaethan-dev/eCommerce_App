import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Access token required' });
    }

    // Try verification for each role
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

    // Validate token version against database (for logout invalidation)
    const tokenVersion = decoded.tokenVersion ?? 0; // Treat missing as 0 for backward compatibility
    const Model = userRole === 'admin' ? Admin : Customer;
    const user = await Model.findById(decoded.id).select('tokenVersion');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const dbTokenVersion = user.tokenVersion ?? 0;
    if (tokenVersion !== dbTokenVersion) {
      return res.status(401).json({ error: 'Token has been invalidated. Please login again.' });
    }

    // Attach basic user info to request
    req.user = {
      id: decoded.id,
      role: userRole
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};