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
      console.log('Auth Middleware: No token provided');
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