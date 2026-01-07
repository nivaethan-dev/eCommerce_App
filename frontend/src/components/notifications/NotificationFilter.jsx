import React from 'react';
import './NotificationFilter.css';

/**
 * NotificationFilter Component
 * Allows users to filter and sort notifications
 * Filters: All notifications, Read, Unread
 * Sort: newest first, oldest first
 */
const NotificationFilter = ({ 
  filters,          // Current filter values { status, sortBy }
  onFilterChange    // Callback when filters change
}) => {

  // Handle status filter change
  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  // Handle sort change
  const handleSortChange = (sortBy) => {
    onFilterChange({ ...filters, sortBy });
  };

  // Clear all filters to default
  const handleClearFilters = () => {
    onFilterChange({
      status: 'all',
      sortBy: 'newest'
    });
  };

  // Check if any non-default filters are active
  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.sortBy !== 'newest';

  return (
    <div className="notification-filter">
      <div className="filter-section">
        <label className="filter-label">Filter</label>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filters.status === 'all' ? 'active' : ''}`}
            onClick={() => handleStatusChange('all')}
          >
            📋 All Notifications
          </button>
          <button 
            className={`filter-btn ${filters.status === 'unread' ? 'active' : ''}`}
            onClick={() => handleStatusChange('unread')}
          >
            🔵 Unread
          </button>
          <button 
            className={`filter-btn ${filters.status === 'read' ? 'active' : ''}`}
            onClick={() => handleStatusChange('read')}
          >
            ✓ Read
          </button>
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Sort By</label>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filters.sortBy === 'newest' ? 'active' : ''}`}
            onClick={() => handleSortChange('newest')}
          >
            🕐 Newest First
          </button>
          <button 
            className={`filter-btn ${filters.sortBy === 'oldest' ? 'active' : ''}`}
            onClick={() => handleSortChange('oldest')}
          >
            🕑 Oldest First
          </button>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="filter-section">
          <button 
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            ✕ Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationFilter;

