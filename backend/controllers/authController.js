import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';
import { comparePasswords } from '../utils/securityUtils.js';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';
import * as eventTriggers from '../eventTriggers/authenticationEvent.js';
import { isProduction, formatErrorResponse } from '../utils/errorUtils.js';
import { MAX_ATTEMPTS, LOCK_TIME } from '../config/rateLimitConfig.js';

const handleFailedLogin = async (user, userType, clientInfo) => {
  user.loginAttempts += 1;
  if (user.loginAttempts >= MAX_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + LOCK_TIME);
    await eventTriggers.triggerAccountLocked(user._id, userType, user.email, clientInfo);
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
    // Validation handled by middleware - data is already sanitized
    const { email, password } = req.body;

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
      const clientInfo = req.clientInfo;
      if (!isMatch) {
        await handleFailedLogin(customer, 'Customer', clientInfo);
        await eventTriggers.triggerLoginFailed(email, clientInfo, 'Customer', customer._id);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Reset login attempts on success
      await resetLoginAttempts(customer);

      // Trigger customer login event
      await eventTriggers.triggerCustomerLogin(customer._id, customer.name, clientInfo);

      // Generate tokens (include tokenVersion for logout invalidation)
      const tokenVersion = customer.tokenVersion ?? 0;
      const accessToken = generateAccessToken(customer._id, 'customer', tokenVersion);
      const refreshToken = generateRefreshToken(customer._id, 'customer', null, tokenVersion);
      setAuthCookies(res, accessToken, refreshToken);

      console.log(`[Session] Customer login - User: ${customer._id}, Email: ${email}, IP: ${clientInfo.ip}, Session start: ${new Date().toISOString()}`);

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
      const adminClientInfo = req.clientInfo;
      if (!isMatch) {
        await handleFailedLogin(admin, 'Admin', adminClientInfo);
        await eventTriggers.triggerLoginFailed(email, adminClientInfo, 'Admin', admin._id);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Reset login attempts on success
      await resetLoginAttempts(admin);

      // Trigger admin login event
      await eventTriggers.triggerAdminLogin(admin._id, admin.name, adminClientInfo);

      // Generate tokens (include tokenVersion for logout invalidation)
      const tokenVersion = admin.tokenVersion ?? 0;
      const accessToken = generateAccessToken(admin._id, 'admin', tokenVersion);
      const refreshToken = generateRefreshToken(admin._id, 'admin', null, tokenVersion);
      setAuthCookies(res, accessToken, refreshToken);

      console.log(`[Session] Admin login - User: ${admin._id}, Email: ${email}, IP: ${adminClientInfo.ip}, Session start: ${new Date().toISOString()}`);

      return res.status(200).json({
        success: true,
        message: `Login successful. Welcome back, ${admin.name}!`
      });
    }

    // If not found in either collection
    await eventTriggers.triggerLoginFailed(email, req.clientInfo);
    return res.status(401).json({ success: false, error: 'Invalid credentials' });

  } catch (error) {
    if (!isProduction()) {
      console.error('Login error:', error);
    }
    // Use formatErrorResponse for proper status code mapping
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
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

    // Increment tokenVersion to invalidate all existing tokens
    // Get user info from the token (if available)
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (token) {
      try {
        // Try to decode and invalidate tokens
        let decoded;
        let Model;

        try {
          decoded = jwt.verify(token, process.env.CUSTOMER_JWT_SECRET);
          Model = Customer;
        } catch (err) {
          decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
          Model = Admin;
        }

        // Increment tokenVersion to invalidate all tokens for this user
        await Model.findByIdAndUpdate(decoded.id, { $inc: { tokenVersion: 1 } });
      } catch (err) {
        // Token might be expired/invalid, but still clear cookies
        console.log('Token verification failed during logout, clearing cookies anyway');
      }
    }

    // Clear auth cookies with matching options
    res.clearCookie('token', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    // Use formatErrorResponse for proper status code mapping
    const { statusCode, response } = formatErrorResponse(error);
    return res.status(statusCode).json(response);
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

    console.log(`[Session] Refresh request - User: ${decoded.id}, Role: ${userRole}, Session duration: ${sessionDuration.toFixed(2)}h, Login time: ${loginTime.toISOString()}`);

    if (sessionDuration >= 6) {
      console.log(`[Session] Session expired for user ${decoded.id} after ${sessionDuration.toFixed(2)}h`);
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please login again.',
        sessionExpired: true
      });
    }

    // Generate NEW tokens (preserve original loginTime and tokenVersion for absolute timeout)
    const tokenVersion = decoded.tokenVersion ?? 0;
    const newAccessToken = generateAccessToken(decoded.id, userRole, tokenVersion);
    const newRefreshToken = generateRefreshToken(decoded.id, userRole, decoded.loginTime, tokenVersion);

    // Set BOTH new tokens
    setAuthCookies(res, newAccessToken, newRefreshToken);

    console.log(`[Session] Token refreshed successfully for user ${decoded.id}, ${(6 - sessionDuration).toFixed(2)}h remaining`);
    res.json({ success: true, message: 'Token refreshed' });
  } catch (err) {
    // Invalid or expired token
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};