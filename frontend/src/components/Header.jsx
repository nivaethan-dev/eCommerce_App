import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { get, post } from '../utils/api';
import { API_ENDPOINTS, PRODUCT_CATEGORIES } from '../utils/constants';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Check authentication status and user role whenever location changes
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    setIsAuthenticated(isAuth);
    setIsAdmin(userRole === 'admin');
  }, [location]);

  // Listen for auth change events (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole');
      setIsAuthenticated(isAuth);
      setIsAdmin(userRole === 'admin');
    };
    
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Fetch cart data to get item count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartData = await get(API_ENDPOINTS.CART);
        // Calculate total number of items in cart
        const totalItems = cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartItemCount(totalItems);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        // If cart fetch fails (e.g., user not logged in), set count to 0
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, []);

  // Fetch notifications count for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          // TODO: Replace with actual API call when backend implements notifications
          // const notifications = await get(API_ENDPOINTS.NOTIFICATIONS);
          // setNotificationCount(notifications.unreadCount || 0);
          
          // For now, no notifications
          setNotificationCount(0);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
          setNotificationCount(0);
        }
      };

      fetchNotifications();
    } else {
      setNotificationCount(0);
    }
  }, [isAuthenticated]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear httpOnly cookies
      await post(API_ENDPOINTS.LOGOUT, {});
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    // Clear authentication flag and user role
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setShowProfileDropdown(false);
    setNotificationCount(0);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo/Brand Section */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">CloudCart</span>
          </Link>
        </div>

        {/* Search Bar Section */}
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="search-category"
              aria-label="Select category"
            >
              <option value="">All Categories</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search products"
            />
            
            <button type="submit" className="search-button" aria-label="Search">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>

        {/* Navigation Section */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/products" className="nav-link">
            Products
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          
          {/* Guest View - Login/Signup Button */}
          {!isAuthenticated && (
            <button onClick={handleLoginClick} className="login-button">
              Login
            </button>
          )}
          
          {/* Authenticated View - Notifications Icon */}
          {isAuthenticated && (
            <div className="notification-container" ref={notificationDropdownRef}>
              <button 
                onClick={handleNotificationsClick} 
                className="notification-button"
                aria-label={`Notifications - ${notificationCount} unread`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotificationDropdown && (
                <div className="notification-dropdown">
                  {notificationCount === 0 ? (
                    <div className="notification-empty">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="48" 
                        height="48" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="empty-icon"
                      >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      <p className="empty-text">No new notifications</p>
                      <p className="empty-subtext">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="notification-list">
                      {/* TODO: Map through actual notifications from backend */}
                      <div className="notification-item">
                        <p>Sample notification</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Cart Icon with Badge - Always Visible */}
          <button 
            onClick={handleCartClick} 
            className="cart-button"
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
            )}
          </button>
          
          {/* Authenticated View - Profile Icon with Dropdown */}
          {isAuthenticated && (
            <div className="profile-container" ref={profileDropdownRef}>
              <button 
                onClick={handleProfileClick} 
                className="profile-button"
                aria-label="User profile menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              
              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>View Profile</span>
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    </svg>
                    <span>Account Settings</span>
                  </Link>
                  {isAdmin ? (
                    <Link to="/admin/dashboard" className="dropdown-item">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                      <span>Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link to="/orders" className="dropdown-item">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      <span>Order History</span>
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

