import React, { useState, useMemo, useEffect } from 'react';
import './Notifications.css';
import NotificationList from '../components/notifications/NotificationList';
import NotificationFilter from '../components/notifications/NotificationFilter';
import * as notifApi from '../utils/notificationApi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',      // 'all', 'unread', 'read'
    sortBy: 'newest'    // 'newest', 'oldest'
  });

  // Handler to mark single notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notifApi.markAsReadApi(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Handler to mark ALL notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notifApi.markAllAsReadApi();
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  // Handler to delete single notification
  const handleDelete = async (notificationId) => {
    try {
      await notifApi.deleteNotificationApi(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notif => notif.id !== notificationId)
      );
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Handler when notification is clicked
  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Future: Navigate to relevant page or show details
  };

  // Load notifications from API on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await notifApi.fetchNotifications();

        // Map backend fields to frontend format
        const formattedData = data.map(notif => ({
          ...notif,
          id: notif._id,
          timestamp: notif.createdAt
        }));

        setNotifications(formattedData);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

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

  // Calculate stats
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

