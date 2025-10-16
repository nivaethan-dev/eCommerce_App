import Customer from '../models/Customer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '../utils/tokenUtils.js';

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

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const customer = await Customer.findById(req.user.id);
    const index = customer.cart.findIndex(item => item.productId.toString() === productId);
    if (index > -1) customer.cart[index].quantity += quantity;
    else customer.cart.push({ productId, quantity });
    await customer.save();
    res.json({ cart: customer.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const customer = await Customer.findById(req.user.id);
    customer.cart = customer.cart.filter(item => item.productId.toString() !== productId);
    await customer.save();
    res.json({ cart: customer.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};