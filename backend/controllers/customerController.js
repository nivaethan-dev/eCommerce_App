import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';
import { getCustomers, addToCart as addToCartService, removeFromCart as removeFromCartService, getCart as getCartService, updateCartQuantity as updateCartItemService } from '../services/customerService.js';
import { isUserError, getErrorStatusCode } from '../utils/cartErrors.js';
import { CART_MESSAGES } from '../utils/cartMessages.js';
import * as eventTriggers from '../eventTriggers/authenticationEvent.js';

// Register
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password)
      return res.status(400).json({ success: false, error: 'All fields are required' });

    // Sanitize inputs to prevent XSS and injection attacks
    const sanitizedName = validator.trim(validator.escape(String(name)));
    const sanitizedEmail = validator.normalizeEmail(validator.trim(String(email)));
    const sanitizedPhone = validator.trim(String(phone));

    // Validate sanitized inputs
    if (!sanitizedName || sanitizedName.length < 2)
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters' });

    if (!validator.isEmail(sanitizedEmail)) 
      return res.status(400).json({ success: false, error: 'Invalid email' });

    if (!validator.isMobilePhone(sanitizedPhone, 'si-LK')) 
      return res.status(400).json({ success: false, error: 'Invalid phone number' });

    let normalizedPhone = sanitizedPhone.startsWith('+94') ? sanitizedPhone : '+94' + sanitizedPhone.slice(1);

    if (!validator.isStrongPassword(password, {
      minLength: 12, 
      minSymbols: 1,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1 
    })) {
      return res.status(400).json({ success: false, error: 'Weak password' });
    }

    // Check if customer exists (using sanitized inputs)
    const existingCustomer = await Customer.findOne({ $or: [{ email: sanitizedEmail }, { phone: normalizedPhone }] });
    if(existingCustomer){
      return res.status(400).json({ success: false, error: 'Customer already exists' });
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer (using sanitized inputs)
    const customer = await Customer.create({ name: sanitizedName, email: sanitizedEmail, phone: normalizedPhone, password: hashedPassword });

    // Trigger signup event (notification to customer + audit log for admins)
    await eventTriggers.triggerCustomerSignup(customer._id, sanitizedName, sanitizedEmail, req.ip);

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
        error: CART_MESSAGES.PRODUCT_ID_REQUIRED 
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        error: CART_MESSAGES.QUANTITY_MINIMUM 
      });
    }

    const cartData = await addToCartService(req.user.id, productId, quantity);
    res.status(201).json({ 
      success: true, 
      message: CART_MESSAGES.ITEM_ADDED,
      cart: cartData.items,
      summary: cartData.summary
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    
    const statusCode = getErrorStatusCode(err);
    const isUserFacing = isUserError(err);
    
    return res.status(statusCode).json({
      success: false,
      error: isUserFacing ? err.message : CART_MESSAGES.ADD_TO_CART_FAILED
    });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const cartData = await getCartService(req.user.id);
    res.status(200).json({ 
      success: true, 
      message: CART_MESSAGES.CART_RETRIEVED,
      cart: cartData.items,
      summary: cartData.summary
    });
  } catch (err) {
    console.error('Get cart error:', err);
    
    const statusCode = getErrorStatusCode(err);
    const isUserFacing = isUserError(err);
    
    return res.status(statusCode).json({
      success: false,
      error: isUserFacing ? err.message : CART_MESSAGES.GET_CART_FAILED
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
        error: CART_MESSAGES.PRODUCT_ID_REQUIRED 
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ 
        success: false, 
        error: CART_MESSAGES.QUANTITY_REQUIRED 
      });
    }

    if (quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        error: CART_MESSAGES.QUANTITY_NON_NEGATIVE 
      });
    }

    const result = await updateCartItemService(req.user.id, productId, quantity);
    res.status(200).json({ 
      success: true, 
      message: result.wasRemoved ? CART_MESSAGES.ITEM_REMOVED : CART_MESSAGES.ITEM_UPDATED,
      cart: result.items,
      summary: result.summary
    });
  } catch (err) {
    console.error('Update cart item error:', err);
    
    const statusCode = getErrorStatusCode(err);
    const isUserFacing = isUserError(err);
    
    return res.status(statusCode).json({
      success: false,
      error: isUserFacing ? err.message : CART_MESSAGES.UPDATE_CART_FAILED
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
        error: CART_MESSAGES.PRODUCT_ID_REQUIRED 
      });
    }

    const cartData = await removeFromCartService(req.user.id, productId);
    res.status(200).json({ 
      success: true, 
      message: CART_MESSAGES.ITEM_REMOVED,
      cart: cartData.items,
      summary: cartData.summary
    });
  } catch (err) {
    console.error('Remove from cart error:', err);
    
    const statusCode = getErrorStatusCode(err);
    const isUserFacing = isUserError(err);
    
    return res.status(statusCode).json({
      success: false,
      error: isUserFacing ? err.message : CART_MESSAGES.REMOVE_FROM_CART_FAILED
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