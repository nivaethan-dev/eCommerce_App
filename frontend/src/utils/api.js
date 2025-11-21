/**
 * API utility functions for making requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Make a fetch request with default options
 * @param {string} endpoint - API endpoint (e.g., '/api/products')
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function apiFetch(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    
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
 */
export const get = (endpoint) => apiFetch(endpoint, { method: 'GET' });

/**
 * POST request
 */
export const post = (endpoint, data) => 
  apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * PUT request
 */
export const put = (endpoint, data) => 
  apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/**
 * DELETE request
 */
export const del = (endpoint) => 
  apiFetch(endpoint, { method: 'DELETE' });

