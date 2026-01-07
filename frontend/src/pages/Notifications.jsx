import React, { useState, useEffect } from 'react';
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const itemsPerPage = 10;

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

  // Load notifications from API (triggers on page or filter change)
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch notifications with current pagination and filters
        const response = await notifApi.fetchNotifications({
          page: currentPage,
          limit: itemsPerPage,
          status: filters.status,
          sortBy: filters.sortBy
        });

        // Backend now returns { data: [...], pagination: {...} }
        const formattedData = response.data.map(notif => ({
          ...notif,
          id: notif._id,
          timestamp: notif.createdAt
        }));

        setNotifications(formattedData);
        // Store pagination metadata for display
        setTotalPages(response.pagination.totalPages);
        setTotalNotifications(response.pagination.total);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [currentPage, filters]); // Re-fetch when page or filters change

  // Handler for filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Calculate unread count from current page notifications
  // Note: This is an approximation. For accurate total unread count,
  // we'd need a separate API endpoint or include it in the response metadata
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
            notifications={notifications}
            totalNotifications={totalNotifications}
            totalUnreadCount={unreadCount}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDelete}
            onClick={handleNotificationClick}
            isLoading={isLoading}
            error={error}
          />

          {/* Pagination Controls */}
          {!isLoading && !error && totalNotifications > 0 && (
            <div className="pagination-controls">
              <button
                className="pagination-btn prev-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="pagination-btn next-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

