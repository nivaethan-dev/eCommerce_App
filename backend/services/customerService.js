import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import { fetchDocuments } from '../utils/queryHelper.js';

// Exclude sensitive fields in the service
export const getCustomers = async (role, userId, queryParams) => {
  return await fetchDocuments(Customer, {
    search: queryParams.search,
    searchFields: ['name', 'email', 'phone'],
    query: {}
  }, { 
    role, 
    userId, 
    ownerField: '_id',
    selectFields: '-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt'
  });
};

// Add product to customer's cart
export const addToCart = async (customerId, productId, quantity) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Check if product is in stock
  if (product.stock <= 0) {
    throw new Error('Product is out of stock');
  }

  const index = customer.cart.findIndex(item => item.productId.toString() === productId.toString());
  
  if (index > -1) {
    // Product already in cart - check if adding more would exceed stock
    const newQuantity = customer.cart[index].quantity + quantity;
    if (newQuantity > product.stock) {
      throw new Error(`Only ${product.stock} items available in stock. You already have ${customer.cart[index].quantity} in your cart.`);
    }
    customer.cart[index].quantity = newQuantity;
  } else {
    // New product - check if requested quantity exceeds stock
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} items available in stock`);
    }
    customer.cart.push({ productId, quantity });
  }
  
  await customer.save();
  return customer.cart;
};

// Get customer's cart with product details
export const getCart = async (customerId) => {
  const customer = await Customer.findById(customerId).populate('cart.productId');
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Filter out products that no longer exist
  const validCartItems = customer.cart.filter(item => item.productId !== null);
  
  // Update cart if any products were removed
  if (validCartItems.length !== customer.cart.length) {
    customer.cart = validCartItems;
    await customer.save();
  }

  return customer.cart;
};

// Update cart item quantity
export const updateCartQuantity = async (customerId, productId, quantity) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Validate quantity
  if (quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }

  // Check if item exists in cart first
  const index = customer.cart.findIndex(item => item.productId.toString() === productId.toString());
  if (index === -1) {
    throw new Error('Product not found in cart');
  }

  if (quantity === 0) {
    // Remove item from cart if quantity is 0
    customer.cart = customer.cart.filter(item => item.productId.toString() !== productId.toString());
    await customer.save();
    return { cart: customer.cart, wasRemoved: true };
  } else {
    // Check stock availability
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    // Update quantity
    customer.cart[index].quantity = quantity;
    await customer.save();
    return { cart: customer.cart, wasRemoved: false };
  }
};

// Remove product from customer's cart
export const removeFromCart = async (customerId, productId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  customer.cart = customer.cart.filter(item => item.productId.toString() !== productId.toString());
  await customer.save();
  return customer.cart;
};
