import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../ui/Image';
import Price from '../ui/Price';
import './ProductCard.css';

/**
 * ProductCard - Individual product display component
 * @param {Object} product - Product object with id, name, price, image
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  // Backend shape (Mongo): _id, title, price, image, description, category, ...
  // Keep compatibility with any mock data still using id/name.
  const id = product?._id || product?.id;
  const name = product?.title || product?.name || 'Untitled product';
  const price = product?.price;
  const description = product?.description;

  // Remote-only images: only render if the backend gives an absolute URL (Cloudinary/etc.)
  // If it's a local uploads path like "uploads/..." or "/uploads/...", we intentionally don't load it.
  const rawImage = product?.image;
  const image =
    typeof rawImage === 'string' &&
    (rawImage.startsWith('http://') ||
      rawImage.startsWith('https://') ||
      rawImage.startsWith('data:'))
      ? rawImage
      : undefined;

  const handleClick = () => {
    // Navigate to product detail page
    navigate(`/products/${id}`);
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
