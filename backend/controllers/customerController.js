import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';
import { getCustomers, addToCart as addToCartService, removeFromCart as removeFromCartService, getCart as getCartService, updateCartQuantity as updateCartItemService } from '../services/customerService.js';
import { isUserError, getErrorStatusCode } from '../utils/cartErrors.js';
import { CART_MESSAGES } from '../utils/cartMessages.js';
import * as eventTriggers from '../eventTriggers/authenticationEvent.js';
import { formatErrorResponse, isProduction, HTTP_STATUS } from '../utils/errorUtils.js';

// Register
export const registerCustomer = async (req, res) => {
  try {
    // Validation handled by middleware - data is already sanitized
    const { name, email, phone, password } = req.body;

    // Check if customer exists (409 Conflict for duplicate)
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { phone }] });
    if (existingCustomer) {
      return res.status(HTTP_STATUS.CONFLICT).json({ success: false, error: 'Customer already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure we have detailed geo info for signup audit logs
    const clientInfo = await req.getDetailedGeo();

    // Create customer
    const customer = await Customer.create({ name, email, phone, password: hashedPassword });

    // Trigger signup event (notification to customer + audit log for admins)
    await eventTriggers.triggerCustomerSignup(customer._id, name, email, clientInfo);

    // Generate tokens & set cookies
    const accessToken = generateAccessToken(customer._id);
    const refreshToken = generateRefreshToken(customer._id);
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({ success: true, message: 'Customer registered' });
  } catch (err) {
    if (!isProduction()) {
      console.error('Registration error:', err);
    }

    // Handle MongoDB duplicate key error (409 Conflict)
    if (err.code === 11000) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        error: 'Customer already exists'
      });
    }

    // Use formatErrorResponse for proper status code mapping
    const { statusCode, response } = formatErrorResponse(err);
    res.status(statusCode).json(response);
  }
};

// Add item to cart
export const addCartItem = async (req, res) => {
  try {
    // Validation handled by middleware - data is already sanitized
    const { productId, quantity } = req.body;

    const cartData = await addToCartService(req.user.id, productId, quantity);
    res.status(201).json({
      success: true,
      message: CART_MESSAGES.ITEM_ADDED,
      cart: cartData.items,
      summary: cartData.summary
    });
  } catch (err) {
    if (!isProduction()) {
      console.error('Add to cart error:', err);
    }

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
    if (!isProduction()) {
      console.error('Get cart error:', err);
    }

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
    // Validation handled by middleware - data is already sanitized
    const { productId } = req.params;
    const { quantity } = req.body;

    const result = await updateCartItemService(req.user.id, productId, quantity);
    res.status(200).json({
      success: true,
      message: result.wasRemoved ? CART_MESSAGES.ITEM_REMOVED : CART_MESSAGES.ITEM_UPDATED,
      cart: result.items,
      summary: result.summary
    });
  } catch (err) {
    if (!isProduction()) {
      console.error('Update cart item error:', err);
    }

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
    // Validation handled by middleware - productId validated as ObjectId
    const { productId } = req.params;

    const cartData = await removeFromCartService(req.user.id, productId);
    res.status(200).json({
      success: true,
      message: CART_MESSAGES.ITEM_REMOVED,
      cart: cartData.items,
      summary: cartData.summary
    });
  } catch (err) {
    if (!isProduction()) {
      console.error('Remove from cart error:', err);
    }

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
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};
