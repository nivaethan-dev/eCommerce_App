import { get, put, del } from './api';

export const fetchNotifications = () => get('/api/notifications');
export const markAsReadApi = (id) => put(`/api/notifications/${id}/read`);
export const markAllAsReadApi = () => put('/api/notifications/read-all');
export const deleteNotificationApi = (id) => del(`/api/notifications/${id}`);