import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { get, post, put, del } from '../utils/api';
import { API_ENDPOINTS, PRODUCT_CATEGORIES } from '../utils/constants';
import './Header.css';

const Header = () => {
  const formatLKR = useCallback((value) => {
    const numeric = typeof value === 'number' && Number.isFinite(value) ? value : Number(value);
    const safe = Number.isFinite(numeric) ? numeric : 0;
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safe);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [updatingCartProductId, setUpdatingCartProductId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  const cartTimeoutRef = useRef(null);

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

  // Function to fetch notifications list
  const fetchNotificationsList = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await get('/api/notifications?page=1&limit=10&status=all&sortBy=newest');
      const formattedNotifications = response.data.map(notif => ({
        ...notif,
        id: notif._id,
        timestamp: notif.createdAt
      }));
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    }
  }, [isAuthenticated]);

  // Listen for notification changes (when notifications are read/deleted)
  useEffect(() => {
    const handleNotificationChange = async () => {
      if (isAuthenticated) {
        try {
          // Refresh unread count
          const response = await get('/api/notifications/unread-count');
          setNotificationCount(response.unreadCount || 0);
          
          // Refresh notifications list if dropdown is open
          if (showNotificationDropdown) {
            await fetchNotificationsList();
          }
        } catch (error) {
          console.error('Failed to refresh notification count:', error);
        }
      }
    };
    
    window.addEventListener('notificationChange', handleNotificationChange);
    
    return () => {
      window.removeEventListener('notificationChange', handleNotificationChange);
    };
  }, [isAuthenticated, showNotificationDropdown, fetchNotificationsList]);

  // Fetch cart data to get item count and items list
  const fetchCartData = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItemCount(0);
      setCartItems([]);
      return;
    }
    try {
      const cartData = await get(API_ENDPOINTS.CART);
      // Backend shape: { success, cart: [...], summary: {...} }
      // Be defensive in case older shape exists.
      const items = Array.isArray(cartData?.cart)
        ? cartData.cart
        : Array.isArray(cartData?.items)
          ? cartData.items
          : [];

      // Calculate total number of items in cart
      const totalItems = items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
      setCartItemCount(totalItems);
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // If cart fetch fails (e.g., user not logged in), set to defaults
      setCartItemCount(0);
      setCartItems([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const updateCartQuantity = useCallback(
    async (productId, nextQuantity) => {
      if (!productId || !isAuthenticated) return;

      try {
        setUpdatingCartProductId(String(productId));
        await put(`/api/customers/cart/items/${productId}`, { quantity: nextQuantity });
        // Refresh from server to keep header consistent with backend stock rules
        await fetchCartData();
        window.dispatchEvent(new Event('cartChange'));
      } catch (error) {
        console.error('Failed to update cart quantity:', error);
        // Best-effort refresh to recover from partial state
        await fetchCartData();
      } finally {
        setUpdatingCartProductId(null);
      }
    },
    [fetchCartData, isAuthenticated]
  );

  const removeCartItem = useCallback(
    async (productId) => {
      if (!productId || !isAuthenticated) return;

      try {
        setUpdatingCartProductId(String(productId));
        await del(API_ENDPOINTS.CART_REMOVE(productId));
        await fetchCartData();
        window.dispatchEvent(new Event('cartChange'));
      } catch (error) {
        console.error('Failed to remove cart item:', error);
        await fetchCartData();
      } finally {
        setUpdatingCartProductId(null);
      }
    },
    [fetchCartData, isAuthenticated]
  );

  // Listen for cart change events
  useEffect(() => {
    window.addEventListener('cartChange', fetchCartData);
    return () => {
      window.removeEventListener('cartChange', fetchCartData);
    };
  }, [fetchCartData]);

  // Fetch notifications count for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const response = await get('/api/notifications/unread-count');
          setNotificationCount(response.unreadCount || 0);
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
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setShowCartDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Cleanup timeouts on unmount
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
  };

  const handleCartClick = () => {
    // Cart now shows on hover - click does nothing
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCartHover = (show) => {
    // Clear any existing timeout
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }

    if (show) {
      // Show immediately
      setShowCartDropdown(true);
      // Ensure hover dropdown always shows latest server cart
      fetchCartData();
    } else {
      // Delay before hiding
      cartTimeoutRef.current = setTimeout(() => {
        setShowCartDropdown(false);
      }, 200); // 200ms delay before closing
    }
  };

  const handleNotificationsHover = async (show) => {
    // Clear any existing timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = null;
    }

    if (show) {
      // Show immediately
      setShowNotificationDropdown(true);
      
      // Fetch notifications when opening dropdown
      await fetchNotificationsList();
    } else {
      // Delay before hiding
      notificationTimeoutRef.current = setTimeout(() => {
        setShowNotificationDropdown(false);
      }, 200); // 200ms delay before closing
    }
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
          <Link to="/about-us" className="nav-link">
            About Us
          </Link>
          
          {/* Notifications Icon - Available for everyone */}
          <div 
            className="notification-container" 
            ref={notificationDropdownRef}
            onMouseEnter={() => handleNotificationsHover(true)}
            onMouseLeave={() => handleNotificationsHover(false)}
          >
            <button 
              className="notification-button"
              aria-label={isAuthenticated ? `Notifications - ${notificationCount} unread` : 'Notifications'}
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
              {isAuthenticated && notificationCount > 0 && (
                <span className="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div className="notification-dropdown">
                {!isAuthenticated ? (
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
                    <p className="empty-text">
                      Please <Link to="/login" className="sign-in-link">sign-in</Link> to view notifications.
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
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
                    <p className="empty-text">No notifications</p>
                    <p className="empty-subtext">You're all caught up!</p>
                  </div>
                ) : (
                  <>
                    <div className="notification-list">
                      {notifications.map((notif) => (
                        <Link 
                          key={notif.id} 
                          to="/notifications" 
                          className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                        >
                          <div className="notification-icon">
                            {!notif.isRead ? '🔔' : '✓'}
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">{notif.title}</div>
                            <div className="notification-message">{notif.message}</div>
                            <div className="notification-time">
                              {new Date(notif.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link to="/notifications" className="view-all-notifications">
                      View All Notifications
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Cart Icon with Badge - Visible for Guests and Customers Only (Not Admins) */}
          {!isAdmin && (
            <div 
              className="cart-container" 
              ref={cartDropdownRef}
              onMouseEnter={() => handleCartHover(true)}
              onMouseLeave={() => handleCartHover(false)}
            >
              <button 
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

              {/* Cart Dropdown */}
              {showCartDropdown && (
                <div className="cart-dropdown">
                  <div className="cart-dropdown-header">
                    <div className="cart-dropdown-title">Cart</div>
                    <div className="cart-dropdown-count">
                      {cartItemCount} item{cartItemCount === 1 ? '' : 's'}
                    </div>
                  </div>
                  {cartItems.length === 0 ? (
                  <div className="cart-empty">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="64" 
                      height="64" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="empty-cart-icon"
                    >
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p className="empty-text">Your cart is empty</p>
                    <p className="empty-subtext">Discover amazing products and start adding items to your cart!</p>
                    <Link to="/products" className="browse-products-btn">
                      Browse Products
                    </Link>
                  </div>
                  ) : (
                    <>
                      <div className="cart-items-list">
                        {cartItems.map((item) => (
                          <div
                            key={item.productId?._id || item.productId || item._id}
                            className="cart-dropdown-item"
                          >
                            <div className="cart-item-img-container">
                              <img 
                                src={(() => {
                                  const product =
                                    item?.productId && typeof item.productId === 'object'
                                      ? item.productId
                                      : null;
                                  const img = product?.image;
                                  return typeof img === 'string' && img.startsWith('http')
                                    ? img
                                    : 'https://via.placeholder.com/40';
                                })()}
                                alt={(() => {
                                  const product =
                                    item?.productId && typeof item.productId === 'object'
                                      ? item.productId
                                      : null;
                                  return product?.title || 'Product';
                                })()}
                              />
                            </div>
                            <div className="cart-item-info">
                              {(() => {
                                const product =
                                  item?.productId && typeof item.productId === 'object'
                                    ? item.productId
                                    : null;
                                const pid =
                                  product?._id ||
                                  (typeof item?.productId === 'string' ? item.productId : null) ||
                                  item?._id ||
                                  item?.id;
                                const title = product?.title || 'Product';
                                const unitPrice = Number(product?.price) || 0;
                                const currentQty = Number(item?.quantity) || 0;
                                const maxStock = Number(product?.stock) || Infinity;
                                const disabled = !pid || updatingCartProductId === String(pid);
                                const lineTotal = formatLKR(unitPrice * currentQty);

                                return (
                                  <>
                                    <div className="cart-item-top">
                                      <div className="cart-item-name" title={title}>
                                        {title}
                                      </div>
                                      <div className="cart-item-line-total">Rs. {lineTotal}</div>
                                    </div>

                                      <div className="cart-item-bottom">
                                      <div className="cart-item-qty-controls">
                                        <button
                                          type="button"
                                          className="cart-qty-btn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            updateCartQuantity(pid, Math.max(0, currentQty - 1));
                                          }}
                                          disabled={disabled || currentQty <= 0}
                                          aria-label="Decrease quantity"
                                        >
                                          −
                                        </button>
                                        <span className="cart-qty-value">{currentQty}</span>
                                        <button
                                          type="button"
                                          className="cart-qty-btn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            updateCartQuantity(pid, Math.min(maxStock, currentQty + 1));
                                          }}
                                          disabled={disabled || currentQty >= maxStock}
                                          aria-label="Increase quantity"
                                        >
                                          +
                                        </button>
                                      </div>

                                      <div className="cart-item-unit-price">
                                        Rs. {formatLKR(unitPrice)} each
                                      </div>
                                        <button
                                          type="button"
                                          className="cart-item-remove-btn"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeCartItem(pid);
                                          }}
                                          disabled={disabled}
                                          aria-label="Remove item from cart"
                                        >
                                          Remove
                                        </button>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="cart-dropdown-footer">
                        <div className="cart-total-row">
                          <span>Total:</span>
                          <span className="cart-total-price">
                            Rs. {formatLKR(cartItems
                              .reduce((sum, item) => {
                                const product =
                                  item?.productId && typeof item.productId === 'object'
                                    ? item.productId
                                    : null;
                                const price = Number(product?.price) || 0;
                                const qty = Number(item?.quantity) || 0;
                                return sum + qty * price;
                              }, 0))}
                          </span>
                        </div>
                        <Link to="/cart" className="browse-products-btn">
                          View Cart
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Guest View - Login/Signup Button */}
          {!isAuthenticated && (
            <button onClick={handleLoginClick} className="login-button">
              Login
            </button>
          )}
          
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

