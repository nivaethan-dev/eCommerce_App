import { get, put, del } from './api';

export const fetchNotifications = (params = {}) => {
    // Build query string from parameters
    const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        status: params.status || 'all',
        sortBy: params.sortBy || 'newest'
    }).toString();

    return get(`/api/notifications?${queryParams}`);
};

export const markAsReadApi = (id) => put(`/api/notifications/${id}/read`);
export const markAllAsReadApi = () => put('/api/notifications/read-all');
export const deleteNotificationApi = (id) => del(`/api/notifications/${id}`);
export const getUnreadCountApi = () => get('/api/notifications/unread-count');