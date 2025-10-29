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
    
    await session.withTransaction(async () => {
      // Get customer with populated cart within transaction
      const customer = await Customer.findById(customerId).populate('cart.productId').session(session);
      
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
          // Skip if product no longer exists
          continue;
        }
        
        const product = cartItem.productId;
        const quantity = cartItem.quantity;
        const price = product.price; // Snapshot of price at purchase time
        const itemSubtotal = price * quantity;
        
        // Validate stock availability
        if (product.stock < quantity) {
          throw new Error(formatOrderMessage(ORDER_MESSAGES.INSUFFICIENT_STOCK, {
            productTitle: product.title,
            stock: product.stock,
            quantity: quantity
          }));
        }
        
        items.push({
          productId: product._id,
          name: product.title, // Store product name as snapshot
          quantity: quantity,
          price: price, // Unit price
          subtotal: Math.round(itemSubtotal * 100) / 100 // Round to 2 decimal places
        });
        
        // Update product stock
        product.stock -= quantity;
        await product.save({ session });
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

