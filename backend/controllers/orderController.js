import { 
  createOrderFromCart, 
  getCustomerOrders, 
  getAllOrders, 
  getOrderById,
  updateOrderStatus 
} from '../services/orderService.js';
import { ORDER_MESSAGES, VALID_ORDER_STATUSES, formatOrderMessage } from '../utils/orderMessages.js';

/**
 * Place order (simulated checkout)
 * POST /api/customers/orders
 */
export const placeOrder = async (req, res) => {
  try {
    const customerId = req.user.id;

    const order = await createOrderFromCart(customerId);

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
    const { status, limit, skip } = req.query;
    
    const options = {
      status: status || undefined,
      limit: limit ? parseInt(limit, 10) : 50,
      skip: skip ? parseInt(skip, 10) : 0
    };

    // Validate limit and skip
    if (isNaN(options.limit) || options.limit < 1 || options.limit > 100) {
      return res.status(400).json({
        success: false,
        error: ORDER_MESSAGES.LIMIT_INVALID
      });
    }

    if (isNaN(options.skip) || options.skip < 0) {
      return res.status(400).json({
        success: false,
        error: ORDER_MESSAGES.SKIP_INVALID
      });
    }

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
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate input
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: ORDER_MESSAGES.ORDER_ID_REQUIRED
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        error: ORDER_MESSAGES.STATUS_REQUIRED
      });
    }

    // Validate status value
    if (!VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: formatOrderMessage(ORDER_MESSAGES.STATUS_INVALID, {
          statuses: VALID_ORDER_STATUSES.join(', ')
        })
      });
    }

    const order = await updateOrderStatus(orderId, status);

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
