import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';
import { getCustomers, addToCart as addToCartService, removeFromCart as removeFromCartService, getCart as getCartService, updateCartQuantity as updateCartItemService } from '../services/customerService.js';

// Register
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password)
      return res.status(400).json({ success: false, error: 'All fields are required' });

    if (!validator.isEmail(email)) 
      return res.status(400).json({ success: false, error: 'Invalid email' });

    if (!validator.isMobilePhone(phone, 'si-LK')) 
      return res.status(400).json({ success: false, error: 'Invalid phone number' });

    let normalizedPhone = phone.startsWith('+94') ? phone : '+94' + phone.slice(1);

    if (!validator.isStrongPassword(password, {
      minLength: 12, 
      minSymbols: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1 
    })) {
      return res.status(400).json({ success: false, error: 'Weak password' });
    }

    // Check if customer exists
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });
    if(existingCustomer){
      return res.status(400).json({ success: false, error: 'Customer already exists' });
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = await Customer.create({ name, email, phone: normalizedPhone, password: hashedPassword });

    // Generate tokens & set cookies
    const accessToken = generateAccessToken(customer._id);
    const refreshToken = generateRefreshToken(customer._id);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({ success: true, message: 'Customer registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

// Add item to cart
export const addCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product ID is required' 
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantity must be at least 1' 
      });
    }

    const cart = await addToCartService(req.user.id, productId, quantity);
    res.status(201).json({ 
      success: true, 
      message: 'Product added to cart successfully',
      cart 
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    
    // Handle specific error cases
    if (err.message.includes('not found') || err.message.includes('out of stock') || err.message.includes('Only')) {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add product to cart' 
    });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const cart = await getCartService(req.user.id);
    res.status(200).json({ 
      success: true, 
      message: 'Cart retrieved successfully',
      cart 
    });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve cart' 
    });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product ID is required' 
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantity is required' 
      });
    }

    if (quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Quantity cannot be negative' 
      });
    }

    const result = await updateCartItemService(req.user.id, productId, quantity);
    res.status(200).json({ 
      success: true, 
      message: result.wasRemoved ? 'Product removed from cart successfully' : 'Cart quantity updated successfully',
      cart: result.cart
    });
  } catch (err) {
    console.error('Update cart item error:', err);
    
    // Handle specific error cases
    if (err.message.includes('Product not found in cart')) {
      return res.status(404).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    if (err.message.includes('Product not found')) {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    if (err.message.includes('Only') || err.message.includes('cannot be negative')) {
      return res.status(400).json({ 
        success: false, 
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update cart item' 
    });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate input
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Product ID is required' 
      });
    }

    const cart = await removeFromCartService(req.user.id, productId);
    res.status(200).json({ 
      success: true, 
      message: 'Product removed from cart successfully',
      cart 
    });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to remove product from cart' 
    });
  }
};

// Fetch customers (Admin only)
export const fetchCustomers = async (req, res) => {
  try {
    const customers = await getCustomers(req.user.role, req.user.id, req.query);
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};