import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';
import { getGeolocation } from '../utils/geoipUtils.js';

// ============================================
// ORDER PLACED TRIGGERS
// ============================================

// Customer Places Order - Notify customer and log
export const triggerOrderPlaced = async (orderId, customerId, totalAmount, ipAddress) => {
    try {
        // Create notification for customer
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

        // Create audit log
        const geolocation = getGeolocation(ipAddress);
        await auditService.createAuditLog({
            userId: customerId,
            userType: 'Customer',
            action: 'ORDER_PLACED',
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

// Admin Receives New Order Notification
export const triggerNewOrderForAdmin = async (orderId, customerId, totalAmount, adminId, ipAddress) => {
    try {
        // Create notification for admin
        await notificationService.createNotification(
            adminId,
            'Admin',
            {
                type: 'new_order',
                title: 'New Order Received',
                message: `New order #${orderId} received. Total: ₹${totalAmount}`,
                priority: 'high',
                metadata: { orderId, customerId, totalAmount }
            }
        );

        // Create audit log
        const geolocation = getGeolocation(ipAddress);
        await auditService.createAuditLog({
            userId: adminId,
            userType: 'Admin',
            action: 'NEW_ORDER',
            resource: 'Order',
            resourceId: orderId,
            endpoint: '/api/orders',
            method: 'POST',
            ipAddress,
            geolocation,
            status: 'success',
            changes: { customerId, totalAmount }
        });
    } catch (error) {
        console.error('New order admin trigger error:', error);
    }
};

// ============================================
// ORDER STATUS UPDATE TRIGGER
// ============================================

// Order Status Updated - Notify customer and log
export const triggerOrderStatusUpdate = async (orderId, customerId, oldStatus, newStatus, ipAddress) => {
    try {
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
        const geolocation = getGeolocation(ipAddress);
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
