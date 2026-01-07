import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';
import { getGeolocation } from '../utils/geoipUtils.js';
import Admin from '../models/Admin.js';

// Helper to notify all admins
const notifyAllAdmins = async (title, message, type, metadata, priority = 'medium') => {
    try {
        const admins = await Admin.find({});
        for (const admin of admins) {
            await notificationService.createNotification(
                admin._id,
                'Admin',
                { type, title, message, metadata, priority }
            );
        }
    } catch (error) {
        console.error('Failed to notify admins:', error);
    }
};

// ============================================
// PRODUCT CREATED TRIGGER
// ============================================

// Admin Creates Product
export const triggerProductCreated = async (productId, productName, adminId, ipAddress) => {
    try {
        // 1. Notify all admins
        await notifyAllAdmins(
            'New Product Added',
            `Product "${productName}" has been added to the catalog.`,
            'product_created',
            { productId, productName },
            'low'
        );

        // 2. Create audit log
        const geolocation = getGeolocation(ipAddress);
        await auditService.createAuditLog({
            userId: adminId,
            userType: 'Admin',
            action: 'PRODUCT_CREATED',
            resource: 'Product',
            resourceId: productId,
            endpoint: '/api/products',
            method: 'POST',
            ipAddress,
            geolocation,
            status: 'success',
            changes: { productName }
        });
    } catch (error) {
        console.error('Product created trigger error:', error);
    }
};

// ============================================
// PRODUCT UPDATED TRIGGER
// ============================================

// Admin Updates Product
export const triggerProductUpdated = async (productId, productName, oldData, newData, adminId, ipAddress) => {
    try {
        // Calculate diffs for notification
        const changes = {};
        const diffs = [];

        Object.keys(newData).forEach(key => {
            // Only compare if key exists in newData and is different
            if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
                changes[key] = newData[key]; // For audit log (new values)

                // Special formatting for image field to avoid messy paths
                if (key === 'image') {
                    diffs.push(`image: (updated)`);
                } else {
                    diffs.push(`${key}: ${oldData[key]} -> ${newData[key]}`);
                }
            }
        });

        const formattedDiff = diffs.join(', ');

        // 1. Notify all admins
        await notifyAllAdmins(
            'Product Updated',
            `Product "${productName}" was updated. Changes: ${formattedDiff}`,
            'product_updated',
            { productId, productName, changes, diff: formattedDiff },
            'medium'
        );

        // 2. Create audit log
        const geolocation = getGeolocation(ipAddress);
        await auditService.createAuditLog({
            userId: adminId,
            userType: 'Admin',
            action: 'PRODUCT_UPDATED',
            resource: 'Product',
            resourceId: productId,
            endpoint: '/api/products',
            method: 'PUT',
            ipAddress,
            geolocation,
            status: 'success',
            changes: { // Store the explicit old -> new mapping for audit history
                productName,
                updates: changes,
                description: formattedDiff
            }
        });
    } catch (error) {
        console.error('Product updated trigger error:', error);
    }
};

// ============================================
// PRODUCT DELETED TRIGGER
// ============================================

// Admin Deletes Product
export const triggerProductDeleted = async (productId, productName, oldProductData, adminId, ipAddress) => {
    try {
        const { price, stock } = oldProductData || {};
        const details = `(Price: ${price}, Stock: ${stock})`;

        // 1. Notify all admins (High Priority)
        await notifyAllAdmins(
            '⚠️ Product Deleted',
            `Product "${productName}" ${details} has been PERMANENTLY deleted.`,
            'product_deleted',
            { productId, productName, deletedData: oldProductData },
            'high'
        );

        // 2. Create audit log
        const geolocation = getGeolocation(ipAddress);
        await auditService.createAuditLog({
            userId: adminId,
            userType: 'Admin',
            action: 'PRODUCT_DELETED',
            resource: 'Product',
            resourceId: productId,
            endpoint: '/api/products',
            method: 'DELETE',
            ipAddress,
            geolocation,
            status: 'success',
            changes: { // Save full snapshot of deleted data for potential recovery
                productName,
                deletedSnapshot: oldProductData
            }
        });
    } catch (error) {
        console.error('Product deleted trigger error:', error);
    }
};
