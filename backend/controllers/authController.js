import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';

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