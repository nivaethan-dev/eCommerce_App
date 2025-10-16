import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import { comparePasswords } from '../utils/securityUtils.js';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';

// Unified login for both customers and admins
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Try finding the user in Customer collection
    const customer = await Customer.findOne({ email });
    if (customer) {
      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

      // Generate tokens
      const accessToken = generateAccessToken(customer._id, 'customer');
      const refreshToken = generateRefreshToken(customer._id);
      setAuthCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        message: `Login successful. Welcome back, ${customer.name}!`
      });
    }

    // Try finding the user in Admin collection
    const admin = await Admin.findOne({ email });
    if (admin) {
      const isMatch = await comparePasswords(password, admin.password);
      if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

      const accessToken = generateAccessToken(admin._id, 'admin');
      const refreshToken = generateRefreshToken(admin._id);
      setAuthCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        message: `Login successful. Welcome back, ${admin.name}!`
      });
    }

    // If not found in either collection
    return res.status(401).json({ success: false, error: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict'
    };

    // Clear auth cookies with matching options
    res.clearCookie('token', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error during logout'
    });
  }
};

// Refresh Token - WITH ROTATION
export const refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    // When No refresh token
    if (!oldRefreshToken) {
      console.error('Refresh token error: No refresh token provided'); // server log
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Verify the old refresh token
    const decoded = jwt.verify(oldRefreshToken, process.env.CUSTOMER_REFRESH_JWT_SECRET);

    // Generate NEW tokens (both access AND refresh)
    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);
    
    // Set BOTH new tokens
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ success: true, message: 'Token refreshed' });
  } catch (err) {
    // Invalid or expired token
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};