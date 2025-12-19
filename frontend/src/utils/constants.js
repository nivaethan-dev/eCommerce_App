/**
 * Application constants
 */

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,
  
  // Customers
  CUSTOMERS: '/api/customers',
  CUSTOMER_REGISTER: '/api/customers/register',
  CUSTOMER_PROFILE: '/api/customers/profile',
  
  // Cart
  CART: '/api/customers/cart',
  CART_ADD: '/api/customers/cart/add',
  CART_UPDATE: '/api/customers/cart/update',
  CART_REMOVE: (productId) => `/api/customers/cart/remove/${productId}`,
  
  // Admins
  ADMINS: '/api/admins',
  ADMIN_REGISTER: '/api/admins/register',
  
  // Notifications (TODO: Backend to implement)
  // NOTIFICATIONS: '/api/notifications',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
];

// App configuration
export const APP_CONFIG = {
  APP_NAME: 'E-commerce App',
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

