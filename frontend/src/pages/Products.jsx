import React from 'react';
import CategorySection from '../components/products/CategorySection';
import { useProducts } from '../hooks/useProducts';
import './Products.css';

const Products = () => {
  const { productsByCategory, categories, loading, error } = useProducts();

  const handleViewAll = (category) => {
    console.log('View all products in category:', category);
    // TODO: Navigate to category page or show all products
  };

  if (loading) {
    return (
      <div className="products">
        <div className="products-container">
          <div className="products-loading">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products">
        <div className="products-container">
          <div className="products-error">
            <p>Error loading products: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="products-container">
        <h1 className="products-title">Our Products</h1>
        <p className="products-subtitle">
          Discover amazing products across all categories
        </p>
        
        <div className="products-content">
          {categories.map((category) => (
            productsByCategory[category] && productsByCategory[category].length > 0 && (
              <CategorySection
                key={category}
                category={category}
                products={productsByCategory[category]}
                onViewAll={() => handleViewAll(category)}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
