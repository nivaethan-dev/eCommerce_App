import { useState, useEffect } from 'react';
import { get } from '../utils/api';
import { API_ENDPOINTS, PRODUCT_CATEGORIES } from '../utils/constants';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

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

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
  };

  const handleCartClick = () => {
    // TODO: Navigate to cart page
    console.log('Navigate to cart');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo/Brand Section */}
        <div className="header-logo">
          <a href="/" className="logo-link">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">CloudCart</span>
          </a>
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
          <a href="/" className="nav-link active">
            Home
          </a>
          <a href="/products" className="nav-link">
            Products
          </a>
          <a href="/about" className="nav-link">
            About Us
          </a>
          <a href="/contact" className="nav-link">
            Contact
          </a>
          
          {/* Cart Icon with Badge */}
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
        </nav>
      </div>
    </header>
  );
};

export default Header;

