import React from 'react';
import './NotificationItem.css';
import { 
  formatNotificationTime, 
  getNotificationIcon, 
  getPriorityClass,
  getCategoryClass 
} from '../../utils/notificationHelpers';

/**
 * NotificationItem Component
 * Displays a single notification with read/unread status, priority, and actions
 */
const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onClick 
}) => {
  const {
    id,
    type,
    category,
    title,
    message,
    timestamp,
    isRead,
    priority
  } = notification;

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    // Auto mark as read when clicked
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (onDelete) {
      onDelete(id);
    }
  };

  const icon = getNotificationIcon(type);
  const priorityClass = getPriorityClass(priority);
  const categoryClass = getCategoryClass(category);
  const readClass = isRead ? 'notification-read' : 'notification-unread';

  return (
    <div 
      className={`notification-item ${readClass} ${priorityClass} ${categoryClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Priority Indicator */}
      <div className={`notification-priority-indicator priority-${priority}`}></div>
      
      {/* Icon */}
      <div className="notification-icon">
        <span className="notification-emoji">{icon}</span>
      </div>

      {/* Content */}
      <div className="notification-content">
        <div className="notification-header">
          <h4 className="notification-title">{title}</h4>
          <span className="notification-time">
            {formatNotificationTime(timestamp)}
          </span>
        </div>
        
        <p className="notification-message">{message}</p>
        
        {/* Category Badge */}
        <span className={`notification-category-badge category-${category}`}>
          {category}
        </span>
      </div>

      {/* Actions */}
      <div className="notification-actions">
        {!isRead && (
          <button
            className="notification-action-btn mark-read-btn"
            onClick={handleMarkAsRead}
            title="Mark as read"
            aria-label="Mark as read"
          >
            <span className="action-icon">✓</span>
          </button>
        )}
        
        {onDelete && (
          <button
            className="notification-action-btn delete-btn"
            onClick={handleDelete}
            title="Delete notification"
            aria-label="Delete notification"
          >
            <span className="action-icon">✕</span>
          </button>
        )}
      </div>

      {/* Unread Indicator Dot */}
      {!isRead && <div className="notification-unread-dot"></div>}
    </div>
  );
};

export default NotificationItem;

