import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { calculateOrderTotalsFromItems } from '../utils/orderCalculationUtils.js';
import { ORDER_MESSAGES, formatOrderMessage, DEFAULT_ORDER_STATUS } from '../utils/orderMessages.js';

/**
 * Convert customer's cart to an order
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>} Created order
 */
export const createOrderFromCart = async (customerId) => {
  const session = await mongoose.startSession();
  
  try {
    let order;
    
    // MongoDB transaction ensures atomicity:
    // - All stock updates are temporary until transaction commits
    // - If any operation fails (stock insufficient, order creation fails, etc.),
    //   MongoDB automatically rolls back ALL changes including stock decrements
    // - Multiple concurrent orders are isolated - no overselling possible
    await session.withTransaction(async () => {
      // Get customer with cart (no population - we'll fetch products within transaction)
      const customer = await Customer.findById(customerId).session(session);
      
      if (!customer) {
        throw new Error(ORDER_MESSAGES.CUSTOMER_NOT_FOUND);
      }
      
      // Check if cart is empty
      if (!customer.cart || customer.cart.length === 0) {
        throw new Error(ORDER_MESSAGES.CART_EMPTY);
      }
      
      // Build order items with product snapshots
      const items = [];
      
      for (const cartItem of customer.cart) {
        if (!cartItem.productId) {
          // Skip if product reference is missing
          continue;
        }
        
        const quantity = cartItem.quantity;
        
        // Fetch product directly within transaction with session
        // This ensures we get the latest stock value and it's part of the transaction
        const product = await Product.findById(cartItem.productId).session(session);
        
        if (!product) {
          // Product no longer exists - skip this item
          continue;
        }
        
        // Use atomic operation to validate and decrement stock
        // This prevents race conditions by checking and updating in a single atomic operation
        const updateResult = await Product.findOneAndUpdate(
          {
            _id: product._id,
            stock: { $gte: quantity }  // Only match if stock is sufficient
          },
          {
            $inc: { stock: -quantity }  // Atomic decrement
          },
          {
            session,
            new: true,
            runValidators: true
          }
        );
        
        // If updateResult is null, stock was insufficient or product was deleted
        if (!updateResult) {
          // Re-fetch product to get current stock for error message
          const currentProduct = await Product.findById(cartItem.productId).session(session);
          throw new Error(formatOrderMessage(ORDER_MESSAGES.INSUFFICIENT_STOCK, {
            productTitle: currentProduct?.title || 'Unknown Product',
            stock: currentProduct?.stock || 0,
            quantity: quantity
          }));
        }
        
        // Use the updated product for order item snapshot
        const price = updateResult.price;
        const itemSubtotal = price * quantity;
        
        items.push({
          productId: product._id,
          name: updateResult.title, // Store product name as snapshot
          quantity: quantity,
          price: price, // Unit price snapshot at purchase time
          subtotal: Math.round(itemSubtotal * 100) / 100 // Round to 2 decimal places
        });
      }
      
      if (items.length === 0) {
        throw new Error(ORDER_MESSAGES.NO_VALID_ITEMS);
      }
      
      // Calculate order totals from actual items (not original cart)
      // This ensures totals match the items that were successfully validated and added
      const orderTotals = calculateOrderTotalsFromItems(items);
      
      // Create order
      order = await Order.create([{
        customer: customerId,
        items: items,
        subTotal: orderTotals.subTotal,
        tax: orderTotals.tax,
        totalAmount: orderTotals.totalAmount,
        status: DEFAULT_ORDER_STATUS
      }], { session });
      
      // Clear customer's cart after successful order creation
      customer.cart = [];
      await customer.save({ session });
      
      order = order[0]; // Create returns array
    });
    
    // Populate customer and product references for response
    await order.populate('customer', 'name email');
    await order.populate('items.productId', 'title image category');
    
    return order;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * Create order from provided items
 * @param {string} customerId - Customer ID
 * @param {Array} orderItemsInput - Array of { productId, quantity }
 * @returns {Promise<Object>} Created order
 */
export const createOrderFromItems = async (customerId, orderItemsInput) => {
  const session = await mongoose.startSession();
  
  try {
    let order;
    
    await session.withTransaction(async () => {
      // Get customer
      const customer = await Customer.findById(customerId).session(session);
      
      if (!customer) {
        throw new Error(ORDER_MESSAGES.CUSTOMER_NOT_FOUND);
      }
      
      if (!orderItemsInput || orderItemsInput.length === 0) {
        throw new Error(ORDER_MESSAGES.NO_VALID_ITEMS);
      }
      
      const items = [];
      
      for (const inputItem of orderItemsInput) {
        const { productId, quantity } = inputItem;
        
        if (!productId || !quantity || quantity < 1) {
          continue;
        }
        
        const product = await Product.findById(productId).session(session);
        
        if (!product) {
          throw new Error(formatOrderMessage(ORDER_MESSAGES.PRODUCT_NOT_FOUND, { productId }));
        }
        
        // Atomic stock decrement
        const updateResult = await Product.findOneAndUpdate(
          {
            _id: product._id,
            stock: { $gte: quantity }
          },
          {
            $inc: { stock: -quantity }
          },
          {
            session,
            new: true,
            runValidators: true
          }
        );
        
        if (!updateResult) {
          throw new Error(formatOrderMessage(ORDER_MESSAGES.INSUFFICIENT_STOCK, {
            productTitle: product.title,
            stock: product.stock,
            quantity: quantity
          }));
        }
        
        const price = updateResult.price;
        const itemSubtotal = price * quantity;
        
        items.push({
          productId: product._id,
          name: updateResult.title,
          quantity: quantity,
          price: price,
          subtotal: Math.round(itemSubtotal * 100) / 100
        });
      }
      
      if (items.length === 0) {
        throw new Error(ORDER_MESSAGES.NO_VALID_ITEMS);
      }
      
      const orderTotals = calculateOrderTotalsFromItems(items);
      
      order = await Order.create([{
        customer: customerId,
        items: items,
        subTotal: orderTotals.subTotal,
        tax: orderTotals.tax,
        totalAmount: orderTotals.totalAmount,
        status: DEFAULT_ORDER_STATUS
      }], { session });
      
      order = order[0];
    });
    
    await order.populate('customer', 'name email');
    await order.populate('items.productId', 'title image category');
    
    return order;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order with populated references
 */
export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate('customer', 'name email phone address')
      .populate('items.productId', 'title image category description');
    
    if (!order) {
      throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
    }
    
    return order;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all orders for a customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} Array of orders
 */
export const getCustomerOrders = async (customerId) => {
  try {
    const orders = await Order.find({ customer: customerId })
      .populate('items.productId', 'title image category')
      .sort({ createdAt: -1 }); // Most recent first
    
    return orders;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all orders (Admin function)
 * @param {Object} options - Query options
 * @param {string} options.status - Filter by status
 * @param {number} options.limit - Limit results
 * @param {number} options.skip - Skip results (pagination)
 * @returns {Promise<Object>} Orders with pagination info
 */
export const getAllOrders = async (options = {}) => {
  try {
    const { status, limit = 50, skip = 0 } = options;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('customer', 'name email phone')
        .populate('items.productId', 'title image category')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Order.countDocuments(query)
    ]);
    
    return {
      orders,
      total,
      limit,
      skip,
      hasMore: skip + orders.length < total
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update order status (Admin function)
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true, runValidators: true }
    )
      .populate('customer', 'name email')
      .populate('items.productId', 'title image category');
    
    if (!order) {
      throw new Error(ORDER_MESSAGES.ORDER_NOT_FOUND);
    }
    
    return order;
  } catch (error) {
    throw error;
  }
};

