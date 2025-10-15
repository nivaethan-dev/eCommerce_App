import Customer from '../models/customer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, email, phone, password: hashedPassword });
    res.status(201).json({ message: 'Customer registered', id: customer._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, customer.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

export default customerController;