import React from 'react';
import Image from '../ui/Image';
import Price from '../ui/Price';
import './ProductCard.css';

/**
 * ProductCard - Individual product display component
 * @param {Object} product - Product object with id, name, price, image
 */
const ProductCard = ({ product }) => {
  const { id, name, price, image, description } = product;

  const handleClick = () => {
    // Navigate to product detail page
    console.log('Navigate to product:', id);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-card-image">
        <Image 
          src={image} 
          alt={name}
          className="product-image"
        />
      </div>
      <div className="product-card-content">
        <h3 className="product-name">{name}</h3>
        {description && (
          <p className="product-description">{description}</p>
        )}
        <Price amount={price} className="product-price" />
      </div>
    </div>
  );
};

export default ProductCard;

