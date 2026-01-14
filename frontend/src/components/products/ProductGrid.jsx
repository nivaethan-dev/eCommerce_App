import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

/**
 * ProductGrid - Layout container for products with responsive grid
 * @param {Array} products - Array of product objects
 */
const ProductGrid = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard 
          key={product?._id || product?.id} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;
