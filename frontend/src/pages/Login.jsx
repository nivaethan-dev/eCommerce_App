import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await post(API_ENDPOINTS.LOGIN, {
        email: formData.email,
        password: formData.password
      });

      // Backend uses httpOnly cookies for authentication (more secure)
      // Check if login was successful
      if (response.success) {
        // Set a flag in localStorage to indicate user is logged in
        // (The actual token is in httpOnly cookie)
        localStorage.setItem('isAuthenticated', 'true');
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('authChange'));

        // Redirect to home page or last visited page
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
        navigate(redirectTo);
      } else {
        setApiError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setApiError(error.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          {apiError && (
            <div className="error-message" role="alert">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-footer">
              <a href="/forgot-password" className="forgot-password-link">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Don't have an account?</span>
          </div>

          <Link to="/signup" className="signup-link">
            Create a New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

