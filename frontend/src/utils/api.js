/**
 * API utility functions for making requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Clear authentication state and redirect to login
 */
function handleAuthError() {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  window.dispatchEvent(new Event('authChange'));
  
  // Only redirect if not already on login/signup page
  if (!window.location.pathname.includes('/login') && 
      !window.location.pathname.includes('/signup')) {
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
  }
}

/**
 * Make a fetch request with default options
 * @param {string} endpoint - API endpoint (e.g., '/api/products')
 * @param {Object} options - Fetch options
 * @param {boolean} options.requireAuth - Whether this endpoint requires authentication (default: false)
 * @returns {Promise<any>} - Response data
 */
export async function apiFetch(endpoint, options = {}) {
  const { requireAuth = false, ...fetchOptions } = options;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    credentials: 'include', // Include cookies for authentication
    ...fetchOptions,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Only redirect if this was an authenticated request
      if (requireAuth) {
        handleAuthError();
        throw new Error('Session expired. Please log in again.');
      }
      // For public endpoints, just throw the error without redirecting
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional options
 * @param {boolean} options.requireAuth - Whether this endpoint requires authentication
 */
export const get = (endpoint, options = {}) => 
  apiFetch(endpoint, { method: 'GET', ...options });

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @param {boolean} options.requireAuth - Whether this endpoint requires authentication
 */
export const post = (endpoint, data, options = {}) => 
  apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @param {boolean} options.requireAuth - Whether this endpoint requires authentication
 */
export const put = (endpoint, data, options = {}) => 
  apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional options
 * @param {boolean} options.requireAuth - Whether this endpoint requires authentication
 */
export const del = (endpoint, options = {}) => 
  apiFetch(endpoint, { method: 'DELETE', ...options });


