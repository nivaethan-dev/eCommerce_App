import * as notificationService from '../services/notificationService.js';

export const getNotifications = async (req, res) => {
  try {
    // Extract pagination params from query
    const pagination = {
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };

    // Extract filter params from query
    const filters = {
      status: req.query.status || 'all',  // 'all', 'read', 'unread'
      sortBy: req.query.sortBy || 'newest' // 'newest', 'oldest'
    };

    const result = await notificationService.getNotifications(
      req.user.id,
      req.user.role,
      filters,
      pagination
    );

    res.json(result);  // Returns { data: [...], pagination: {...} }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id, req.user.role);
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id, req.user.role);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user.id, req.user.role);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id, req.user.role);
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
