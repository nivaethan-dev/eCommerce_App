import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';
import { startSession, stopSession, syncAuthState } from '../utils/sessionManager';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('userRole') === 'admin');
  const [isLoading, setIsLoading] = useState(true);

  // Sync auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      await syncAuthState();
      // Re-read from localStorage after sync
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const role = localStorage.getItem('userRole');
      setIsAuthenticated(isAuth);
      setUserRole(role);
      setIsAdmin(role === 'admin');
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Listen for auth change events
  useEffect(() => {
    const handleAuthChange = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const role = localStorage.getItem('userRole');
      setIsAuthenticated(isAuth);
      setUserRole(role);
      setIsAdmin(role === 'admin');
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  /**
   * Login user and determine role
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, role: string, redirectTo: string, error?: string}>}
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await post(API_ENDPOINTS.LOGIN, { email, password });

      if (!response.success) {
        return { success: false, error: response.error || 'Login failed' };
      }

      // Set auth flag
      localStorage.setItem('isAuthenticated', 'true');
      
      // Start session management
      startSession();
      
      // Check user role
      try {
        const adminCheckResponse = await fetch('/api/admins/customers', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        const role = adminCheckResponse.ok ? 'admin' : 'customer';
        localStorage.setItem('userRole', role);
        setUserRole(role);
        setIsAdmin(role === 'admin');
        setIsAuthenticated(true);
        
        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));

        const redirectTo = role === 'admin' ? '/admin/dashboard' : '/';
        return { success: true, role, redirectTo };
      } catch (roleCheckError) {
        console.log('Role check failed, assuming customer role');
        localStorage.setItem('userRole', 'customer');
        setUserRole('customer');
        setIsAdmin(false);
        setIsAuthenticated(true);
        
        window.dispatchEvent(new Event('authChange'));
        
        return { success: true, role: 'customer', redirectTo: '/' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials and try again.' 
      };
    }
  }, []);

  /**
   * Signup user
   * @param {Object} userData - User registration data
   * @returns {Promise<{success: boolean, redirectTo: string, error?: string}>}
   */
  const signup = useCallback(async (userData) => {
    try {
      const response = await post(API_ENDPOINTS.CUSTOMER_REGISTER, userData);

      if (!response.success) {
        return { success: false, error: response.error || 'Signup failed' };
      }

      // Backend auto-logs in after signup
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'customer');
      
      // Start session management
      startSession();
      
      setIsAuthenticated(true);
      setUserRole('customer');
      setIsAdmin(false);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));

      return { success: true, redirectTo: '/' };
    } catch (error) {
      console.error('Signup failed:', error);
      return { 
        success: false, 
        error: error.message || 'Signup failed. Please try again.' 
      };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await post(API_ENDPOINTS.LOGOUT, {});
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    // Stop session management
    stopSession();

    // Clear auth state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    setIsAdmin(false);

    // Dispatch auth change event
    window.dispatchEvent(new Event('authChange'));
  }, []);

  /**
   * Check if user is authenticated (re-sync with backend)
   */
  const checkAuth = useCallback(async () => {
    await syncAuthState();
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');
    setIsAuthenticated(isAuth);
    setUserRole(role);
    setIsAdmin(role === 'admin');
    return isAuth;
  }, []);

  const value = {
    isAuthenticated,
    userRole,
    isAdmin,
    isLoading,
    login,
    signup,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


