import React from 'react';
import Image from '../../../components/ui/Image';

/**
 * ProductGallery component - Displays the product image
 */
const ProductGallery = ({ image, name }) => {
  return (
    <div className="product-image-section">
      <div className="product-image-container">
        <Image
          src={image}
          alt={name}
          className="product-main-image"
        />
      </div>
    </div>
  );
};

export default ProductGallery;

