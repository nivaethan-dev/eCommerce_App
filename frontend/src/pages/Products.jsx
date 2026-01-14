import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySection from '../components/products/CategorySection';
import { useProductCategoryPreviews } from '../hooks/useProductCategoryPreviews';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const { productsByCategory, categories, loading, error } = useProductCategoryPreviews({
    limitPerCategory: 6
  });

  const handleViewAll = (category) => {
    navigate(`/products/category/${encodeURIComponent(category)}`);
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
