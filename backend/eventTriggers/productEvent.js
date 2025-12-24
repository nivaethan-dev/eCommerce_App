import * as notificationService from '../services/notificationService.js';
import * as auditService from '../services/auditLogService.js';

export const PRODUCT_EVENTS = [
    // Admin Creates Product
    {
        label: 'Product Created',
        code: 'PRODUCT_CREATED',
        target: 'Admin',
        action: 'CREATE',
        payload: {
            productId: 'required'
        }
    },
    // Admin Updates Product
    {
        label: 'Product Updated',
        code: 'PRODUCT_UPDATED',
        target: 'Admin',
        action: 'UPDATE',
        payload: {
            productId: 'required',
            changes: 'required'
        }
    },
    // Admin Deletes Product
    {
        label: 'Product Deleted',
        code: 'PRODUCT_DELETED',
        target: 'Admin',
        action: 'DELETE',
        payload: {
            productId: 'required'
        }
    }
];
