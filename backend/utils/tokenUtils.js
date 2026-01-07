import jwt from 'jsonwebtoken';

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
    { expiresIn: '15m' }
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
    { expiresIn: '6h' }
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
    maxAge: 15 * 60 * 1000 // 15 min
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 6 * 60 * 60 * 1000 // 6 hours
  });
};
