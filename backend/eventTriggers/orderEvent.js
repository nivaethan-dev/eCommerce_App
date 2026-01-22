import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';
import Admin from '../models/Admin.js';

// ============================================
// ORDER PLACED TRIGGERS
// ============================================

// Customer Places Order - Notify customer, notify all admins, and log as NEW_ORDER
export const triggerOrderPlaced = async (orderId, customerId, totalAmount, clientInfo) => {
    try {
        const { ip: ipAddress, country, city, region, timezone } = clientInfo || {};

        // 1. Create notification for customer (ORDER_PLACED)
        await notificationService.createNotification(
            customerId,
            'Customer',
            {
                type: 'order_placed',
                title: 'Order Placed Successfully',
                message: `Your order #${orderId} has been placed successfully. Total: ₹${totalAmount}`,
                priority: 'medium',
                metadata: { orderId, totalAmount }
            }
        );

        // 2. Create notifications for all admins (NEW_ORDER)
        const admins = await Admin.find({});
        for (const admin of admins) {
            await notificationService.createNotification(
                admin._id,
                'Admin',
                {
                    type: 'new_order',
                    title: 'New Order Received',
                    message: `New order #${orderId} received. Total: ₹${totalAmount}`,
                    priority: 'high',
                    metadata: { orderId, customerId, totalAmount }
                }
            );
        }

        // 3. Create audit log - Admin only views NEW_ORDER action
        const geolocation = { country, city, region, timezone };
        await auditService.createAuditLog({
            userId: customerId,
            userType: 'Customer',
            action: 'NEW_ORDER', // Labelled as NEW_ORDER for admin visibility
            resource: 'Order',
            resourceId: orderId,
            endpoint: '/api/orders',
            method: 'POST',
            ipAddress,
            geolocation,
            status: 'success',
            changes: { totalAmount }
        });
    } catch (error) {
        console.error('Order placed trigger error:', error);
    }
};

// ============================================
// ORDER STATUS UPDATE TRIGGER
// ============================================

// Order Status Updated - Notify customer and log
export const triggerOrderStatusUpdate = async (orderId, customerId, oldStatus, newStatus, clientInfo) => {
    try {
        const { ip: ipAddress, country, city, region, timezone } = clientInfo || {};

        // Create notification for customer
        await notificationService.createNotification(
            customerId,
            'Customer',
            {
                type: 'order_status_update',
                title: 'Order Status Updated',
                message: `Your order #${orderId} status changed from ${oldStatus} to ${newStatus}`,
                priority: 'medium',
                metadata: { orderId, oldStatus, newStatus }
            }
        );

        // Create audit log
        const geolocation = { country, city, region, timezone };
        await auditService.createAuditLog({
            userId: customerId,
            userType: 'Customer',
            action: 'ORDER_STATUS_UPDATE',
            resource: 'Order',
            resourceId: orderId,
            endpoint: '/api/orders',
            method: 'PUT',
            ipAddress,
            geolocation,
            status: 'success',
            changes: { oldStatus, newStatus }
        });
    } catch (error) {
        console.error('Order status update trigger error:', error);
    }
};
