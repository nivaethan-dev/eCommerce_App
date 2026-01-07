/**
 * Helper functions for notifications
 */

/**
 * Format notification timestamp to relative time
 */
export const formatNotificationTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Get icon for notification type
 */
export const getNotificationIcon = (type) => {
  const icons = {
    // Customer notifications
    order_confirmed: "✅",
    payment_successful: "💳",
    payment_failed: "❌",
    account_created: "🎉",
    password_reset: "🔑",
    profile_update: "👤",
    
    // Admin notifications
    order_placed: "📦",
    product_created: "➕",
    product_updated: "✏️",
    product_deleted: "🗑️",
    customer_deleted: "👥"
  };
  return icons[type] || "🔔";
};

/**
 * Get CSS class based on priority
 */
export const getPriorityClass = (priority) => {
  return `notification-priority-${priority}`;
};

/**
 * Get CSS class based on category
 */
export const getCategoryClass = (category) => {
  return `notification-category-${category}`;
};

