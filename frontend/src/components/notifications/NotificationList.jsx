import React from 'react';
import './NotificationList.css';
import NotificationItem from './NotificationItem';

/**
 * NotificationList Component
 * Simple container that displays a list of notifications
 * Handles: rendering items, empty state, and "mark all as read" action
 */
const NotificationList = ({ 
  notifications,      // Array of notification objects
  onMarkAsRead,       // Function to mark single notification as read
  onDelete,           // Function to delete single notification
  onClick,            // Function when notification is clicked
  onMarkAllAsRead,    // Function to mark ALL notifications as read
  isLoading = false,  // Shows loading message if true
  error = null        // Shows error message if provided
}) => {

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Show loading state
  if (isLoading) {
    return (
      <div className="notification-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="notification-list-error">
        <p className="error-icon">⚠️</p>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Show empty state
  if (notifications.length === 0) {
    return (
      <div className="notification-list-empty">
        <div className="empty-icon">📭</div>
        <h3>No notifications yet</h3>
        <p>You're all caught up! Check back later for updates.</p>
      </div>
    );
  }

  // Show notifications list
  return (
    <div className="notification-list">
      {/* List Header with "Mark all as read" button */}
      <div className="notification-list-header">
        <div className="notification-count">
          <span className="count-badge">{notifications.length}</span>
          <span className="count-text">
            {notifications.length === 1 ? 'Notification' : 'Notifications'}
          </span>
          {unreadCount > 0 && (
            <span className="unread-badge">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Show "Mark all as read" button only if there are unread notifications */}
        {unreadCount > 0 && onMarkAllAsRead && (
          <button 
            className="mark-all-read-btn"
            onClick={onMarkAllAsRead}
          >
            ✓ Mark all as read
          </button>
        )}
      </div>

      {/* List of notification items */}
      <div className="notification-list-items">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;

