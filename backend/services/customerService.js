import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { fetchDocuments } from '../utils/queryHelper.js';
import { 
  CartError, 
  StockError, 
  ProductError, 
  CartItemError, 
  ValidationError, 
  DatabaseError 
} from '../utils/cartErrors.js';
import { CART_MESSAGES, getStockErrorMessage } from '../utils/cartMessages.js';

// Helper function to validate stock and prevent overselling
const validateStockAvailability = async (productId, requestedQuantity, currentCartQuantity = 0, session) => {
  const product = await Product.findById(productId).session(session);
  if (!product) {
    throw new ProductError(CART_MESSAGES.PRODUCT_NOT_FOUND, productId);
  }
  
  if (product.stock <= 0) {
    throw new StockError(CART_MESSAGES.PRODUCT_OUT_OF_STOCK, product.stock, requestedQuantity);
  }
  
  const totalQuantity = currentCartQuantity + requestedQuantity;
  if (totalQuantity > product.stock) {
    throw new StockError(
      getStockErrorMessage(product.stock, currentCartQuantity),
      product.stock,
      totalQuantity
    );
  }
  
  return product;
};

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
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Find customer and product within transaction
      const customer = await Customer.findById(customerId).session(session);
      if (!customer) {
        throw new CartError(CART_MESSAGES.CUSTOMER_NOT_FOUND, 404, true);
      }

      const index = customer.cart.findIndex(item => item.productId.toString() === productId.toString());
      
      if (index > -1) {
        // Product already in cart - validate stock with current quantity
        const currentQuantity = customer.cart[index].quantity;
        await validateStockAvailability(productId, quantity, currentQuantity, session);
        customer.cart[index].quantity = currentQuantity + quantity;
      } else {
        // New product - validate stock
        await validateStockAvailability(productId, quantity, 0, session);
        customer.cart.push({ productId, quantity });
      }
      
      // Save customer within transaction
      await customer.save({ session });
    });
    
    // Return updated cart after successful transaction
    const customer = await Customer.findById(customerId);
    return customer.cart;
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof CartError) {
      throw error;
    }
    // Wrap unexpected errors
    throw new DatabaseError(CART_MESSAGES.ADD_TO_CART_FAILED, error);
  } finally {
    await session.endSession();
  }
};

// Get customer's cart with product details
export const getCart = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId).populate('cart.productId');
    if (!customer) {
      throw new CartError(CART_MESSAGES.CUSTOMER_NOT_FOUND, 404, true);
    }

    // Filter out products that no longer exist and validate stock
    const validCartItems = [];
    let cartModified = false;

    for (const item of customer.cart) {
      if (item.productId === null) {
        // Product no longer exists
        cartModified = true;
        continue;
      }

      // Check current stock availability
      if (item.productId.stock <= 0) {
        // Product out of stock
        cartModified = true;
        continue;
      }

      // Adjust quantity if it exceeds current stock
      if (item.quantity > item.productId.stock) {
        item.quantity = item.productId.stock;
        cartModified = true;
      }

      validCartItems.push(item);
    }

    // Update cart if any modifications were made
    if (cartModified) {
      customer.cart = validCartItems;
      await customer.save();
    }

    return customer.cart;
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof CartError) {
      throw error;
    }
    // Wrap unexpected errors
    throw new DatabaseError(CART_MESSAGES.GET_CART_FAILED, error);
  }
};

// Update cart item quantity
export const updateCartQuantity = async (customerId, productId, quantity) => {
  const session = await mongoose.startSession();
  
  try {
    let result;
    await session.withTransaction(async () => {
      // Find customer and product within transaction
      const customer = await Customer.findById(customerId).session(session);
      if (!customer) {
        throw new CartError(CART_MESSAGES.CUSTOMER_NOT_FOUND, 404, true);
      }

      // Validate quantity
      if (quantity < 0) {
        throw new ValidationError(CART_MESSAGES.QUANTITY_NON_NEGATIVE, 'quantity');
      }

      // Check if item exists in cart first
      const index = customer.cart.findIndex(item => item.productId.toString() === productId.toString());
      if (index === -1) {
        throw new CartItemError(CART_MESSAGES.PRODUCT_NOT_IN_CART, productId);
      }

      if (quantity === 0) {
        // Remove item from cart if quantity is 0
        customer.cart = customer.cart.filter(item => item.productId.toString() !== productId.toString());
        await customer.save({ session });
        result = { cart: customer.cart, wasRemoved: true };
      } else {
        // Validate stock availability for the new quantity
        await validateStockAvailability(productId, quantity, 0, session);

        // Update quantity
        customer.cart[index].quantity = quantity;
        await customer.save({ session });
        result = { cart: customer.cart, wasRemoved: false };
      }
    });
    
    return result;
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof CartError) {
      throw error;
    }
    // Wrap unexpected errors
    throw new DatabaseError(CART_MESSAGES.UPDATE_CART_FAILED, error);
  } finally {
    await session.endSession();
  }
};

// Remove product from customer's cart
export const removeFromCart = async (customerId, productId) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const customer = await Customer.findById(customerId).session(session);
      if (!customer) {
        throw new CartError(CART_MESSAGES.CUSTOMER_NOT_FOUND, 404, true);
      }

      customer.cart = customer.cart.filter(item => item.productId.toString() !== productId.toString());
      await customer.save({ session });
    });
    
    // Return updated cart after successful transaction
    const customer = await Customer.findById(customerId);
    return customer.cart;
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof CartError) {
      throw error;
    }
    // Wrap unexpected errors
    throw new DatabaseError(CART_MESSAGES.REMOVE_FROM_CART_FAILED, error);
  } finally {
    await session.endSession();
  }
};
