import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';

export const ORDER_EVENTS = [
    // Customer Places Order
    {
        label: 'Order Placed',
        code: 'ORDER_PLACED',
        target: 'Customer',
        action: 'CREATE',
        payload: {
            orderId: 'required',
            totalAmount: 'required'
        }
    },
    // Admin receievs new order
    {
        label: 'Order Placed',
        code: 'NEW_ORDER',
        target: 'Admin',
        action: 'CREATE',
        payload: {
            orderId: 'required',
            customerId: 'required',
            totalAmount: 'required'
        }
    },
    // Customer Receives Order Status Update
    {
        label: 'Order Status Updated',
        code: 'ORDER_STATUS_UPDATE',
        target: 'Customer',
        action: 'UPDATE',
        payload: {
            orderId: 'required',
            oldStatus: 'required',
            newStatus: 'required'
        }
    }
];
