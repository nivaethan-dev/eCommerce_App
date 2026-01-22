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
import { isProduction, formatErrorResponse, AppError, HTTP_STATUS } from '../utils/errorUtils.js';

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

    // Ensure we have detailed geo info for order audit logs
    const clientInfo = await req.getDetailedGeo();

    // Trigger order placed event (customer & admin notifications + audit log)
    await orderTriggers.triggerOrderPlaced(
      order._id,
      customerId,
      order.totalAmount,
      clientInfo
    );

    res.status(201).json({
      success: true,
      message: ORDER_MESSAGES.ORDER_PLACED,
      order: order
    });
  } catch (error) {
    if (!isProduction()) {
      console.error('Place order error:', error);
    }

    // Handle specific error cases - check for known order error messages (400 Bad Request)
    const knownBadRequestErrors = [
      ORDER_MESSAGES.CART_EMPTY,
      ORDER_MESSAGES.NO_VALID_ITEMS,
      ORDER_MESSAGES.CUSTOMER_NOT_FOUND
    ];

    const isKnownBadRequest = knownBadRequestErrors.some(msg => error.message === msg) ||
      error.message.includes(ORDER_MESSAGES.INSUFFICIENT_STOCK.split(':')[0]);

    if (isKnownBadRequest) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: error.message
      });
    }

    // Use formatErrorResponse for proper status code mapping
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
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
    if (!isProduction()) {
      console.error('Get customer orders error:', error);
    }
    // Use formatErrorResponse for proper status code mapping
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
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
    if (!isProduction()) {
      console.error('List all orders error:', error);
    }
    // Use formatErrorResponse for proper status code mapping
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
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
      req.clientInfo
    );

    res.status(200).json({
      success: true,
      message: ORDER_MESSAGES.ORDER_STATUS_UPDATED,
      order: order
    });
  } catch (error) {
    if (!isProduction()) {
      console.error('Update order status error:', error);
    }

    // Handle known safe error: Order not found (404)
    if (error.message === ORDER_MESSAGES.ORDER_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: error.message
      });
    }

    // Use formatErrorResponse for proper status code mapping
    const { statusCode, response } = formatErrorResponse(error);
    res.status(statusCode).json(response);
  }
};
