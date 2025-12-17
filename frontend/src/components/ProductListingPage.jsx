import React, { useState } from 'react';
import './ProductListingPage.css';

const ProductListingPage = () => {
  // Sample product data - 8 categories with 4 products each
  const products = [
    // Electronics
    { id: 1, name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 89.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', stock: 50 },
    { id: 2, name: 'Smart Watch Pro', category: 'Electronics', price: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', stock: 30 },
    { id: 3, name: 'Laptop Stand Aluminum', category: 'Electronics', price: 45.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', stock: 100 },
    { id: 4, name: 'USB-C Hub Adapter', category: 'Electronics', price: 34.99, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop', stock: 75 },
    
    // Fashion
    { id: 5, name: 'Leather Crossbody Bag', category: 'Fashion', price: 79.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', stock: 40 },
    { id: 6, name: 'Aviator Sunglasses', category: 'Fashion', price: 129.99, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop', stock: 60 },
    { id: 7, name: 'Minimalist Wrist Watch', category: 'Fashion', price: 159.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop', stock: 25 },
    { id: 8, name: 'Canvas Sneakers', category: 'Fashion', price: 69.99, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop', stock: 90 },
    
    // Home & Garden
    { id: 9, name: 'Ceramic Plant Pot Set', category: 'Home & Garden', price: 39.99, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop', stock: 80 },
    { id: 10, name: 'Bamboo Cutting Board', category: 'Home & Garden', price: 29.99, image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=500&h=500&fit=crop', stock: 120 },
    { id: 11, name: 'LED String Lights', category: 'Home & Garden', price: 24.99, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&h=500&fit=crop', stock: 150 },
    { id: 12, name: 'Decorative Throw Pillows', category: 'Home & Garden', price: 34.99, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop', stock: 70 },
    
    // Sports
    { id: 13, name: 'Yoga Mat Premium', category: 'Sports', price: 49.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop', stock: 95 },
    { id: 14, name: 'Resistance Bands Set', category: 'Sports', price: 29.99, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop', stock: 110 },
    { id: 15, name: 'Water Bottle Stainless', category: 'Sports', price: 24.99, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop', stock: 200 },
    { id: 16, name: 'Running Armband', category: 'Sports', price: 19.99, image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop', stock: 85 },
    
    // Books
    { id: 17, name: 'The Great Gatsby', category: 'Books', price: 14.99, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=500&fit=crop', stock: 45 },
    { id: 18, name: 'Thinking Fast and Slow', category: 'Books', price: 18.99, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop', stock: 60 },
    { id: 19, name: 'Design Patterns', category: 'Books', price: 49.99, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop', stock: 30 },
    { id: 20, name: 'Cookbook Mediterranean', category: 'Books', price: 24.99, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', stock: 55 },
    
    // Toys
    { id: 21, name: 'Building Blocks Set', category: 'Toys', price: 39.99, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=500&fit=crop', stock: 75 },
    { id: 22, name: 'Puzzle 1000 Pieces', category: 'Toys', price: 24.99, image: 'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=500&h=500&fit=crop', stock: 65 },
    { id: 23, name: 'Remote Control Car', category: 'Toys', price: 59.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', stock: 40 },
    { id: 24, name: 'Art Supplies Set', category: 'Toys', price: 34.99, image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&h=500&fit=crop', stock: 90 },
    
    // Beauty
    { id: 25, name: 'Skincare Gift Set', category: 'Beauty', price: 79.99, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop', stock: 50 },
    { id: 26, name: 'Makeup Brush Set', category: 'Beauty', price: 44.99, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop', stock: 70 },
    { id: 27, name: 'Hair Dryer Professional', category: 'Beauty', price: 89.99, image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500&h=500&fit=crop', stock: 35 },
    { id: 28, name: 'Nail Polish Collection', category: 'Beauty', price: 29.99, image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=500&h=500&fit=crop', stock: 100 },
    
    // Health
    { id: 29, name: 'Vitamins Multivitamin', category: 'Health', price: 24.99, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop', stock: 150 },
    { id: 30, name: 'Blood Pressure Monitor', category: 'Health', price: 59.99, image: 'https://images.unsplash.com/photo-1615486511262-c52720e1aa52?w=500&h=500&fit=crop', stock: 45 },
    { id: 31, name: 'Essential Oils Set', category: 'Health', price: 39.99, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop', stock: 80 },
    { id: 32, name: 'Fitness Tracker Band', category: 'Health', price: 49.99, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop', stock: 60 }
  ];

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Health'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Security: Sanitize input to prevent XSS (React handles this by default, but good to be aware)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="product-listing-page">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">Discover Our Collection</h1>
        <p className="page-subtitle">Explore our curated selection across 8 unique categories</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          maxLength={100} // Security: Limit input length
        />
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  loading="lazy" // Performance optimization
                />
                <div className="product-badge">{product.category}</div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-bottom">
                  <div className="price-stock">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <span className="product-stock">Stock: {product.stock}</span>
                  </div>
                  <button className="add-to-cart-btn">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <p>No products found matching your search</p>
          </div>
        )}
      </div>

      {/* Product Count */}
      <div className="product-count">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default ProductListingPage;

