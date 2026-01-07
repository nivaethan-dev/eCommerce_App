import React, { useState } from 'react';
import './Image.css';

/**
 * Image - Reusable image component with loading and error handling
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Additional CSS classes
 */
const Image = ({ src, alt = 'Product image', className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Fallback image if src is missing or has error
  const imageSrc = hasError || !src 
    ? 'https://picsum.photos/seed/noimage/400/400' 
    : src;

  return (
    <div className={`image-container ${className}`}>
      {isLoading && <div className="image-loading">Loading...</div>}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`image ${isLoading ? 'image-hidden' : ''}`}
      />
    </div>
  );
};

export default Image;

