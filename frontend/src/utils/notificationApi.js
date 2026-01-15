import { get, put, del } from './api';
import { isAuthenticatedClient } from './auth';

export const fetchNotifications = (params = {}) => {
    if (!isAuthenticatedClient()) {
        return Promise.resolve({ data: [], pagination: { totalPages: 1, total: 0 } });
    }
    // Build query string from parameters
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'all',
        sortBy: params.sortBy || 'newest'
    }).toString();

    return get(`/api/notifications?${queryParams}`);
};

export const markAsReadApi = (id) =>
    isAuthenticatedClient() ? put(`/api/notifications/${id}/read`) : Promise.resolve({ success: true });
export const markAllAsReadApi = () =>
    isAuthenticatedClient() ? put('/api/notifications/read-all') : Promise.resolve({ success: true });
export const deleteNotificationApi = (id) =>
    isAuthenticatedClient() ? del(`/api/notifications/${id}`) : Promise.resolve({ success: true });
export const getUnreadCountApi = () =>
    isAuthenticatedClient() ? get('/api/notifications/unread-count') : Promise.resolve({ unreadCount: 0 });