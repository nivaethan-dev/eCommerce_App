import Admin from '../models/Admin.js';
import { comparePasswords } from '../utils/securityUtils.js';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(admin._id, 'admin');
    const refreshToken = generateRefreshToken(admin._id);

    // Set auth cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Return success with admin info (excluding sensitive data)
    return res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
