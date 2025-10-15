import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';

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