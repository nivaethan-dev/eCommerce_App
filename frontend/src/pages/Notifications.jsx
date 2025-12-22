import React, { useState, useMemo, useEffect } from 'react';
import './Notifications.css';
import NotificationList from '../components/notifications/NotificationList';
import NotificationFilter from '../components/notifications/NotificationFilter';
import { mockNotifications } from '../data/mockNotifications';

/**
 * Notifications Page
 * Displays user notifications
 * ✅ NotificationItem - COMPLETED
 * ✅ NotificationList - COMPLETED
 * ✅ NotificationFilter - COMPLETED
 * ✅ EmptyNotificationState - COMPLETED (built into NotificationList)
 */
const Notifications = () => {
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') || 'customer';
  
  // Filter notifications by user role
  const roleFilteredNotifications = mockNotifications.filter(
    notification => notification.category === userRole
  );
  
  const [notifications, setNotifications] = useState(roleFilteredNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',      // 'all', 'unread', 'read'
    sortBy: 'newest'    // 'newest', 'oldest'
  });

  // Handler to mark single notification as read
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  // Handler to mark ALL notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Handler to delete single notification
  const handleDelete = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== notificationId)
    );
  };

  // Handler when notification is clicked
  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Future: Navigate to relevant page or show details
  };

  // Update notifications when component mounts or when switching between roles
  useEffect(() => {
    const roleBasedNotifications = mockNotifications.filter(
      notification => notification.category === userRole
    );
    setNotifications(roleBasedNotifications);
  }, [userRole]);

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Apply filters and sorting to notifications
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // Filter by status
    if (filters.status === 'unread') {
      result = result.filter(n => !n.isRead);
    } else if (filters.status === 'read') {
      result = result.filter(n => n.isRead);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      
      if (filters.sortBy === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return result;
  }, [notifications, filters]);

  // Calculate stats (from original notifications, not filtered)
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Page Header */}
        <div className="notifications-header">
          <h1>Notifications</h1>
        </div>

        {/* Main Content */}
        <div className="notifications-content">
          {/* NotificationFilter Component */}
          <NotificationFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* NotificationList Component */}
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDelete}
            onClick={handleNotificationClick}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;

