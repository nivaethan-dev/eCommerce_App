/**
 * API utility functions for making requests to the backend
 */

import { PROTECTED_ENDPOINT_PREFIXES, PUBLIC_ENDPOINT_PREFIXES, USER_ROLES } from './constants';

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || '';
// Avoid IPv6 localhost resolution issues in some environments (ECONNREFUSED to ::1)
const API_BASE_URL = RAW_API_BASE_URL.startsWith('http://localhost')
  ? RAW_API_BASE_URL.replace('http://localhost', 'http://127.0.0.1')
  : RAW_API_BASE_URL.startsWith('https://localhost')
    ? RAW_API_BASE_URL.replace('https://localhost', 'https://127.0.0.1')
    : RAW_API_BASE_URL;

/**
 * Make a fetch request with default options
 * @param {string} endpoint - API endpoint (e.g., '/api/products')
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function apiFetch(endpoint, options = {}) {
  const isApiEndpoint = typeof endpoint === 'string' && endpoint.startsWith('/api/');
  const isPublic = PUBLIC_ENDPOINT_PREFIXES.some((prefix) => endpoint.startsWith(prefix));
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (isApiEndpoint && !isPublic) {
    const isSharedProtected = PROTECTED_ENDPOINT_PREFIXES.shared.some((prefix) =>
      endpoint.startsWith(prefix)
    );
    const isCustomerProtected = PROTECTED_ENDPOINT_PREFIXES.customer.some((prefix) =>
      endpoint.startsWith(prefix)
    );
    const isAdminProtected = PROTECTED_ENDPOINT_PREFIXES.admin.some((prefix) =>
      endpoint.startsWith(prefix)
    );

    if ((isSharedProtected || isCustomerProtected || isAdminProtected) && !isAuthenticated) {
      throw new Error('Unauthorized');
    }

    if (isCustomerProtected && userRole !== USER_ROLES.CUSTOMER) {
      throw new Error('Forbidden');
    }

    if (isAdminProtected && userRole !== USER_ROLES.ADMIN) {
      throw new Error('Forbidden');
    }
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


