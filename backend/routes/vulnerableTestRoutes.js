import express from 'express';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// ✅ FIXED ENDPOINT 1: Get user data WITH authentication and authorization
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    // Authorization check: User can only access their own data
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: You can only access your own profile' 
      });
    }
    
    const user = await Customer.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch user data' });
  }
});

// ✅ FIXED ENDPOINT 2: Update user data WITH authentication and authorization
router.put('/user/:id', authMiddleware, async (req, res) => {
  try {
    // Authorization check: User can only update their own data
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: You can only update your own profile' 
      });
    }
    
    // Prevent updating sensitive fields
    const allowedUpdates = ['name', 'email', 'phone', 'address'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    
    const updatedUser = await Customer.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update user data' });
  }
});

// ✅ FIXED ENDPOINT 3: Delete user WITH authentication and ADMIN role check
router.delete('/user/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    // Only admins can delete users
    const deletedUser = await Customer.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `User ${deletedUser.name} deleted successfully`,
      deletedBy: req.user.id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete user' });
  }
});

// ✅ FIXED ENDPOINT 4: Get all users WITH authentication and ADMIN role check
router.get('/users', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    // Only admins can view all users
    const users = await Customer.find().select('-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt');
    
    res.json({ 
      success: true, 
      count: users.length, 
      users,
      requestedBy: req.user.id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

// ✅ FIXED ENDPOINT 5: Admin action WITH authentication and ADMIN role check
router.post('/admin/delete-product/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    // Only admins can delete products
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `Product "${deletedProduct.title}" deleted successfully`,
      deletedBy: req.user.id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

export default router;