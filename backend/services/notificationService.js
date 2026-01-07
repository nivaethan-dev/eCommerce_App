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

// Get notifications with filtering and pagination
export const getNotifications = async (userId, userType, filters = {}, pagination = { page: 1, limit: 10 }) => {
  const normalizedUserType = validateUserType(userType);

  // Build query with base filters
  const query = { userId, userType: normalizedUserType };

  // Apply status filter (read/unread)
  if (filters.status === 'read') {
    query.isRead = true;
  } else if (filters.status === 'unread') {
    query.isRead = false;
  }
  // If status is 'all' or undefined, don't add isRead filter

  // Determine sort order
  const sortOrder = filters.sortBy === 'oldest' ? 1 : -1; // Default: newest first (-1)

  // Calculate pagination
  const page = parseInt(pagination.page) || 1;
  const limit = parseInt(pagination.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get total count for pagination metadata
    const total = await Notification.countDocuments(query);

    // Fetch paginated notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    // Return data with pagination metadata
    return {
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
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
