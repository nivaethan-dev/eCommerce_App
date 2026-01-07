import React from 'react';
import './Price.css';

/**
 * Price - Reusable price display component with formatting
 * @param {number} amount - Price amount
 * @param {string} currency - Currency symbol (default: $)
 * @param {string} className - Additional CSS classes
 */
const Price = ({ amount, currency = '$', className = '' }) => {
  // Format price to 2 decimal places
  const formattedPrice = typeof amount === 'number' 
    ? amount.toFixed(2) 
    : '0.00';

  return (
    <div className={`price ${className}`}>
      <span className="price-currency">{currency}</span>
      <span className="price-amount">{formattedPrice}</span>
    </div>
  );
};

export default Price;

