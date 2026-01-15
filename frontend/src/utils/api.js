/**
 * API utility functions for making requests to the backend
 */

import { isAuthenticatedClient } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Make a fetch request with default options
 * @param {string} endpoint - API endpoint (e.g., '/api/products')
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
const isProtectedEndpoint = (endpoint = '') => {
  if (!endpoint.startsWith('/api/')) return false;
  if (endpoint.startsWith('/api/auth/')) return false;
  if (endpoint.startsWith('/api/products')) return false;
  if (endpoint === '/api/customers/register') return false;
  if (endpoint === '/api/admins/register') return false;

  return (
    endpoint.startsWith('/api/customers') ||
    endpoint.startsWith('/api/notifications') ||
    endpoint.startsWith('/api/admins')
  );
};

export async function apiFetch(endpoint, options = {}) {
  if (isProtectedEndpoint(endpoint) && !isAuthenticatedClient()) {
    throw new Error('Not authenticated');
  }
  // If we're sending FormData, the browser must set Content-Type (with boundary).
  const isFormDataBody =
    typeof FormData !== 'undefined' &&
    options?.body instanceof FormData;

  const defaultHeaders = isFormDataBody
    ? { ...(options.headers || {}) }
    : {
        'Content-Type': 'application/json',
        ...options.headers,
      };

  const defaultOptions = {
    headers: defaultHeaders,
    credentials: 'include', // Include cookies for authentication
    ...options,
  };

  const doFetch = async (url, opts) => {
    const res = await fetch(url, opts);

    // If token expired, try refresh once then retry original request.
    // This reduces intermittent notification failures due to 15min access token expiry.
    const alreadyRetried = Boolean(opts.__retried);
    const isAuthEndpoint =
      endpoint.startsWith('/api/auth/login') ||
      endpoint.startsWith('/api/auth/refresh-token') ||
      endpoint.startsWith('/api/auth/logout');

    if (res.status === 401 && !alreadyRetried && !isAuthEndpoint) {
      const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (refreshRes.ok) {
        return await doFetch(url, { ...opts, __retried: true });
      }
      // If refresh fails, fall through to normal error handling below.
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      const message =
        (typeof error.error === 'string' && error.error) ||
        error?.error?.message ||
        error?.message ||
        `HTTP error! status: ${res.status}`;
      throw new Error(message);
    }

    return await res.json();
  };

  try {
    return await doFetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
  } catch (error) {
    if (error?.message !== 'Not authenticated') {
      console.error('API request failed:', error);
    }
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
export const post = (endpoint, data, options = {}) =>
  apiFetch(endpoint, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options,
  });

/**
 * PUT request
 */
export const put = (endpoint, data, options = {}) =>
  apiFetch(endpoint, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options,
  });

/**
 * PATCH request
 */
export const patch = (endpoint, data, options = {}) =>
  apiFetch(endpoint, {
    method: 'PATCH',
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options,
  });

/**
 * DELETE request
 */
export const del = (endpoint) => 
  apiFetch(endpoint, { method: 'DELETE' });


