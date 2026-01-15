/**
 * Session Manager - Handles proactive token refresh and session sync
 */

const REFRESH_BUFFER = 60 * 1000; // Refresh 1 min before expiry (14min mark for 15min tokens)
const ACCESS_TOKEN_DURATION = 15 * 60 * 1000; // 15 minutes
const CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

let refreshTimer = null;
let lastActivityTime = Date.now();

/**
 * Update last activity time
 */
export const updateActivity = () => {
  lastActivityTime = Date.now();
};

/**
 * Check if user has been inactive for too long
 * @returns {boolean}
 */
const isInactive = () => {
  const INACTIVITY_THRESHOLD = 30 * 60 * 1000; // 30 minutes
  return Date.now() - lastActivityTime > INACTIVITY_THRESHOLD;
};

/**
 * Proactively refresh access token before it expires
 */
const refreshAccessToken = async () => {
  try {
    // Don't refresh if user is inactive
    if (isInactive()) {
      console.log('[Session] Skipping refresh - user inactive');
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      console.log('[Session] Token refreshed proactively');
      scheduleNextRefresh();
    } else {
      const error = await response.json().catch(() => ({}));
      
      if (error.sessionExpired) {
        console.log('[Session] Session expired, logging out');
        handleSessionExpiry();
      } else {
        console.warn('[Session] Failed to refresh token:', error.error || 'Unknown error');
        // If refresh fails, user will be logged out on next API call
        stopRefreshTimer();
      }
    }
  } catch (err) {
    console.error('[Session] Refresh error:', err);
    // Network error - will retry on next interval or API call will handle it
  }
};

/**
 * Schedule the next token refresh
 */
const scheduleNextRefresh = () => {
  stopRefreshTimer();
  
  const refreshTime = ACCESS_TOKEN_DURATION - REFRESH_BUFFER;
  console.log(`[Session] Next refresh scheduled in ${(refreshTime / 1000 / 60).toFixed(1)} minutes`);
  
  refreshTimer = setTimeout(() => {
    refreshAccessToken();
  }, refreshTime);
};

/**
 * Stop the refresh timer
 */
const stopRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

/**
 * Handle session expiry
 */
const handleSessionExpiry = () => {
  // Clear auth state
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  
  // Dispatch event so components can react
  window.dispatchEvent(new Event('authChange'));
  
  // Stop refresh timer
  stopRefreshTimer();
  
  // Redirect to login if not already there
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
  }
};

/**
 * Sync localStorage with cookie state
 * Call this on app mount to ensure state is consistent
 */
export const syncAuthState = async () => {
  const isAuthenticatedLS = localStorage.getItem('isAuthenticated') === 'true';
  
  // If localStorage says authenticated, verify cookies are still valid
  if (isAuthenticatedLS) {
    try {
      // Try to refresh token to verify session is still valid
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        console.log('[Session] Auth state synced - session valid');
        startSession();
      } else {
        console.log('[Session] Auth state synced - session invalid, clearing');
        handleSessionExpiry();
      }
    } catch (err) {
      console.error('[Session] Failed to sync auth state:', err);
      // On network error, keep localStorage as is - will be validated on next API call
    }
  } else {
    console.log('[Session] No auth state in localStorage');
    stopRefreshTimer();
  }
};

/**
 * Start session management (call after successful login)
 */
export const startSession = () => {
  console.log('[Session] Starting session management');
  updateActivity();
  scheduleNextRefresh();
  
  // Set up activity listeners
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  activityEvents.forEach(event => {
    window.addEventListener(event, updateActivity, { passive: true });
  });
};

/**
 * Stop session management (call on logout)
 */
export const stopSession = () => {
  console.log('[Session] Stopping session management');
  stopRefreshTimer();
  
  // Remove activity listeners
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  activityEvents.forEach(event => {
    window.removeEventListener(event, updateActivity);
  });
};


