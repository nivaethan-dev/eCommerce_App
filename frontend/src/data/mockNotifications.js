/**
 * Mock notification data for testing
 */

export const mockNotifications = [
  // CUSTOMER NOTIFICATIONS
  {
    id: "1",
    type: "order_confirmed",
    category: "customer",
    title: "Order Confirmed",
    message: "Your order #ORD-2024-001 has been confirmed and is being processed",
    timestamp: "2025-12-22T10:30:00Z",
    isRead: false,
    priority: "medium",
    metadata: { orderId: "ORD-2024-001" }
  },
  {
    id: "2",
    type: "payment_successful",
    category: "customer",
    title: "Payment Successful",
    message: "Payment of Rs. 129.99 has been successfully processed for order #ORD-2024-001",
    timestamp: "2025-12-22T09:15:00Z",
    isRead: false,
    priority: "high",
    metadata: { amount: 129.99, orderId: "ORD-2024-001" }
  },
  {
    id: "3",
    type: "payment_failed",
    category: "customer",
    title: "Payment Failed",
    message: "Your payment could not be processed. Please update your payment method and try again",
    timestamp: "2025-12-21T16:45:00Z",
    isRead: false,
    priority: "high",
    metadata: { orderId: "ORD-2024-002" }
  },
  {
    id: "4",
    type: "account_created",
    category: "customer",
    title: "Welcome to Our Store!",
    message: "Your account has been successfully created. Start shopping and enjoy exclusive deals!",
    timestamp: "2025-12-20T14:20:00Z",
    isRead: true,
    priority: "low",
    metadata: {}
  },
  {
    id: "5",
    type: "password_reset",
    category: "customer",
    title: "Password Reset Successful",
    message: "Your password has been successfully reset. You can now login with your new password",
    timestamp: "2025-12-19T11:30:00Z",
    isRead: true,
    priority: "medium",
    metadata: {}
  },
  {
    id: "6",
    type: "profile_update",
    category: "customer",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated",
    timestamp: "2025-12-18T15:45:00Z",
    isRead: true,
    priority: "low",
    metadata: {}
  },
  
  // ADMIN NOTIFICATIONS
  {
    id: "7",
    type: "order_placed",
    category: "admin",
    title: "New Order Placed",
    message: "Customer John Doe placed order #ORD-2024-003 worth Rs. 89.99. Process immediately.",
    timestamp: "2025-12-22T11:00:00Z",
    isRead: false,
    priority: "high",
    metadata: { orderId: "ORD-2024-003", customerId: "CUST-456", amount: 89.99 }
  },
  {
    id: "8",
    type: "product_created",
    category: "admin",
    title: "New Product Added",
    message: "Product 'Wireless Headphones' has been successfully added to the inventory",
    timestamp: "2025-12-22T08:30:00Z",
    isRead: false,
    priority: "low",
    metadata: { productId: "PROD-789", productName: "Wireless Headphones" }
  },
  {
    id: "9",
    type: "product_updated",
    category: "admin",
    title: "Product Updated",
    message: "Product 'Gaming Mouse' details have been updated successfully",
    timestamp: "2025-12-21T15:20:00Z",
    isRead: true,
    priority: "low",
    metadata: { productId: "PROD-123", productName: "Gaming Mouse" }
  },
  {
    id: "10",
    type: "product_deleted",
    category: "admin",
    title: "Product Deleted",
    message: "Product 'Old Keyboard' has been permanently removed from inventory",
    timestamp: "2025-12-21T12:10:00Z",
    isRead: true,
    priority: "medium",
    metadata: { productId: "PROD-456", productName: "Old Keyboard" }
  },
  {
    id: "11",
    type: "customer_deleted",
    category: "admin",
    title: "Customer Account Deleted",
    message: "Customer account (jane@example.com) has been permanently deleted from the system",
    timestamp: "2025-12-20T10:00:00Z",
    isRead: true,
    priority: "medium",
    metadata: { customerId: "CUST-789", email: "jane@example.com" }
  }
];

