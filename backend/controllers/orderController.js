import {
  createOrderFromCart,
  createOrderFromItems,
  getCustomerOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../services/orderService.js';
import { ORDER_MESSAGES, VALID_ORDER_STATUSES, formatOrderMessage } from '../utils/orderMessages.js';
import * as orderTriggers from '../eventTriggers/orderEvent.js';

/**
 * Place order (simulated checkout)
 * POST /api/customers/orders
 */
export const placeOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { items } = req.body;

    let order;
    if (items && Array.isArray(items) && items.length > 0) {
      // Buy It Now (direct order from items)
      order = await createOrderFromItems(customerId, items);
    } else {
      // Standard checkout from cart
      order = await createOrderFromCart(customerId);
    }

    // Trigger order placed event (customer & admin notifications + audit log)
    await orderTriggers.triggerOrderPlaced(
      order._id,
      customerId,
      order.totalAmount,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: ORDER_MESSAGES.ORDER_PLACED,
      order: order
    });
  } catch (error) {
    console.error('Place order error:', error);

    // Handle specific error cases - check for known order error messages
    const knownErrors = [
      ORDER_MESSAGES.CART_EMPTY,
      ORDER_MESSAGES.NO_VALID_ITEMS,
      ORDER_MESSAGES.CUSTOMER_NOT_FOUND
    ];

    const isKnownError = knownErrors.some(msg => error.message === msg) ||
      error.message.includes(ORDER_MESSAGES.INSUFFICIENT_STOCK.split(':')[0]);

    if (isKnownError) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: ORDER_MESSAGES.PLACE_ORDER_FAILED
    });
  }
};

/**
 * Get customer order history
 * GET /api/customers/orders
 */
export const getOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await getCustomerOrders(customerId);

    res.status(200).json({
      success: true,
      message: ORDER_MESSAGES.ORDERS_RETRIEVED,
      orders: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      error: ORDER_MESSAGES.GET_ORDERS_FAILED
    });
  }
};

/**
 * List all orders (Admin)
 * GET /api/admins/orders
 */
export const listAllOrders = async (req, res) => {
  try {
    // Validation handled by middleware - query params are sanitized
    // Use validatedQuery if available, otherwise fall back to req.query
    const query = req.validatedQuery || req.query;
    
    const options = {
      status: query.status || undefined,
      limit: query.limit || 50,
      skip: query.skip || 0
    };

    const result = await getAllOrders(options);

    res.status(200).json({
      success: true,
      message: ORDER_MESSAGES.ORDERS_RETRIEVED,
      orders: result.orders,
      pagination: {
        total: result.total,
        limit: result.limit,
        skip: result.skip,
        hasMore: result.hasMore
      }
    });
  } catch (error) {
    console.error('List all orders error:', error);
    res.status(500).json({
      success: false,
      error: ORDER_MESSAGES.GET_ORDERS_FAILED
    });
  }
};

/**
 * Update order status (Admin)
 * PUT /api/admins/orders/:orderId
 */
export const updateOrder = async (req, res) => {
  try {
    // Validation handled by middleware - params and body are sanitized
    const { orderId } = req.params;
    const { status } = req.body;

    // Get old status before update
    const oldOrder = await getOrderById(orderId);
    const oldStatus = oldOrder.status;

    const order = await updateOrderStatus(orderId, status);

    // Trigger order status update event (notification + audit log)
    await orderTriggers.triggerOrderStatusUpdate(
      order._id,
      order.customerId,
      oldStatus,
      status,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: ORDER_MESSAGES.ORDER_STATUS_UPDATED,
      order: order
    });
  } catch (error) {
    console.error('Update order status error:', error);

    if (error.message === ORDER_MESSAGES.ORDER_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: ORDER_MESSAGES.UPDATE_ORDER_STATUS_FAILED
    });
  }
};
