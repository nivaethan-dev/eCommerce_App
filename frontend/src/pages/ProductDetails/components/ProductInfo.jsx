import React from 'react';
import Price from '../../../components/ui/Price';

/**
 * ProductInfo component - Displays product textual information
 */
const ProductInfo = ({ title, description, category, price }) => {
  return (
    <div className="product-info-section">
      <div className="product-category-tag">{category}</div>
      <h1 className="product-title-large">{title}</h1>
      
      <div className="product-price-container">
        <Price amount={price} className="product-price-large" />
      </div>

      <div className="product-description-container">
        <h3>Description</h3>
        <p className="product-description-text">{description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;

