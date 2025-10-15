import jwt from 'jsonwebtoken';
import Customer from '../models/Customer.js';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userType, id } = decoded;

    if (userType === 'customer') req.user = await Customer.findById(id);
    if (userType === 'admin') req.user = await Admin.findById(id);

    if (!req.user) return res.status(401).json({ error: 'User not found' });

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
