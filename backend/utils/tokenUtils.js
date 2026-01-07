import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '../config/authConfig.js';

/**
 * Generate short-lived access token
 */
export const generateAccessToken = (userId, role = 'customer') => {
  const secret = role === 'admin' ? 
    process.env.ADMIN_JWT_SECRET : 
    process.env.CUSTOMER_JWT_SECRET;
    
  return jwt.sign(
    { id: userId, role },
    secret,
    { expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate long-lived refresh token
 * @param {string} loginTime - ISO timestamp of initial login (for absolute timeout)
 */
export const generateRefreshToken = (userId, role = 'customer', loginTime = null) => {
  const secret = role === 'admin' ? 
    process.env.ADMIN_REFRESH_JWT_SECRET : 
    process.env.CUSTOMER_REFRESH_JWT_SECRET;
  
  // Use provided loginTime or set new one for initial login
  const sessionStart = loginTime || new Date().toISOString();
    
  return jwt.sign(
    { id: userId, role, type: 'refresh', loginTime: sessionStart },
    secret,
    { expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Set auth cookies securely
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE
  });
};
