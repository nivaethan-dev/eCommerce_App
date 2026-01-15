import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';
import { comparePasswords } from '../utils/securityUtils.js';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';
import * as eventTriggers from '../eventTriggers/authenticationEvent.js';

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

const handleFailedLogin = async (user, userType, ipAddress) => {
  user.loginAttempts += 1;
  if (user.loginAttempts >= MAX_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + LOCK_TIME);
    await eventTriggers.triggerAccountLocked(user._id, userType, user.email, ipAddress);
  }
  await user.save();
};

const resetLoginAttempts = async (user) => {
  if (user.loginAttempts > 0 || user.lockUntil) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }
};

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
      // Check if account is locked
      if (customer.lockUntil && customer.lockUntil > Date.now()) {
        const remainingMinutes = Math.ceil((customer.lockUntil - Date.now()) / 60000);
        return res.status(401).json({
          success: false,
          error: `Account is locked due to multiple failed attempts. Please try again in ${remainingMinutes} minutes.`
        });
      }

      const isMatch = await comparePasswords(password, customer.password);
      if (!isMatch) {
        await handleFailedLogin(customer, 'Customer', req.ip);
        await eventTriggers.triggerLoginFailed(email, req.ip, 'Customer', customer._id);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Reset login attempts on success
      await resetLoginAttempts(customer);

      // Trigger customer login event
      await eventTriggers.triggerCustomerLogin(customer._id, customer.name, req.ip);

      // Generate tokens
      const accessToken = generateAccessToken(customer._id, 'customer');
      const refreshToken = generateRefreshToken(customer._id, 'customer');
      setAuthCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        message: `Login successful. Welcome back, ${customer.name}!`
      });
    }

    // Try finding the user in Admin collection
    const admin = await Admin.findOne({ email });
    if (admin) {
      // Check if account is locked
      if (admin.lockUntil && admin.lockUntil > Date.now()) {
        const remainingMinutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
        return res.status(401).json({
          success: false,
          error: `Account is locked due to multiple failed attempts. Please try again in ${remainingMinutes} minutes.`
        });
      }

      const isMatch = await comparePasswords(password, admin.password);
      if (!isMatch) {
        await handleFailedLogin(admin, 'Admin', req.ip);
        await eventTriggers.triggerLoginFailed(email, req.ip, 'Admin', admin._id);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Reset login attempts on success
      await resetLoginAttempts(admin);

      // Trigger admin login event
      await eventTriggers.triggerAdminLogin(admin._id, admin.name, req.ip);

      const accessToken = generateAccessToken(admin._id, 'admin');
      const refreshToken = generateRefreshToken(admin._id, 'admin');
      setAuthCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        message: `Login successful. Welcome back, ${admin.name}!`
      });
    }

    // If not found in either collection
    await eventTriggers.triggerLoginFailed(email, req.ip);
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

// Refresh Token - WITH ROTATION (6-hour absolute session limit)
export const refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    // When No refresh token
    if (!oldRefreshToken) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Try verifying with customer secret first, then admin secret
    let decoded;
    let userRole;

    try {
      decoded = jwt.verify(oldRefreshToken, process.env.CUSTOMER_REFRESH_JWT_SECRET);
      userRole = decoded.role || 'customer';
    } catch (err) {
      try {
        decoded = jwt.verify(oldRefreshToken, process.env.ADMIN_REFRESH_JWT_SECRET);
        userRole = decoded.role || 'admin';
      } catch (err) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
    }

    // Check absolute 6-hour session timeout
    const loginTime = new Date(decoded.loginTime);
    const now = new Date();
    const sessionDuration = (now - loginTime) / 1000 / 60 / 60; // hours

    if (sessionDuration >= 6) {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please login again.',
        sessionExpired: true
      });
    }

    // Generate NEW tokens (preserve original loginTime for absolute timeout)
    const newAccessToken = generateAccessToken(decoded.id, userRole);
    const newRefreshToken = generateRefreshToken(decoded.id, userRole, decoded.loginTime);

    // Set BOTH new tokens
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ success: true, message: 'Token refreshed' });
  } catch (err) {
    // Invalid or expired token
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};