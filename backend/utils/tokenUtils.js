import jwt from 'jsonwebtoken';

/**
 * Generate short-lived access token
 */
export const generateAccessToken = (userId, role = 'customer') => {
  return jwt.sign(
    { id: userId, role },
    process.env.CUSTOMER_JWT_SECRET,
    {
      expiresIn: '15m',
    }
  );
};

/**
 * Generate long-lived refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.CUSTOMER_REFRESH_JWT_SECRET,
    { expiresIn: '7d' }
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
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};
