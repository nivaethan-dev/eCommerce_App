import Notification from '../models/Notification.js';

// Helper function: ensure user type is valid
const validateUserType = (userType) => {
  const normalizedType = userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
  const validTypes = ['Customer', 'Admin'];
  if (!validTypes.includes(normalizedType)) {
    throw new Error(`Invalid user type: ${userType}`);
  }
  return normalizedType;
};

// Create a notification
export const createNotification = async (
  userId,
  userType,
  { type, title, message, metadata, priority = 'medium' }
) => {
  validateUserType(userType);
  try {
    const notification = await Notification.create({
      userId,
      userType,
      type,
      title,
      message,
      metadata,
      priority
    });
    return notification;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

// Get notifications
export const getNotifications = async (userId, userType, filters = {}, pagination = { page: 1, limit: 10 }) => {
  const normalizedUserType = validateUserType(userType);
  const query = { userId, userType: normalizedUserType, ...filters };
  const skip = (pagination.page - 1) * pagination.limit;

  try {
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pagination.limit);
    return notifications;
  } catch (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

// Mark a notification as read
export const markAsRead = async (notificationId, userId, userType) => {
  const normalizedUserType = validateUserType(userType);
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: notificationId, userId, userType: normalizedUserType },
      { isRead: true },
      { new: true }
    );

    if (!updated) throw new Error('Notification not found');
    return updated;
  } catch (error) {
    throw new Error(`Failed to mark as read: ${error.message}`);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (userId, userType) => {
  const normalizedUserType = validateUserType(userType);
  try {
    const result = await Notification.updateMany({ userId, userType: normalizedUserType, isRead: false }, { isRead: true });
    return result;
  } catch (error) {
    throw new Error(`Failed to mark all as read: ${error.message}`);
  }
};

// Delete a notification
export const deleteNotification = async (notificationId, userId, userType) => {
  const normalizedUserType = validateUserType(userType);
  try {
    const deleted = await Notification.findOneAndDelete({ _id: notificationId, userId, userType: normalizedUserType });
    if (!deleted) throw new Error('Notification not found');
    return deleted;
  } catch (error) {
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

// Get the number of unread notifications
export const getUnreadCount = async (userId, userType) => {
  const normalizedUserType = validateUserType(userType);
  try {
    const count = await Notification.countDocuments({ userId, userType: normalizedUserType, isRead: false });
    return count;
  } catch (error) {
    throw new Error(`Failed to count unread notifications: ${error.message}`);
  }
};
