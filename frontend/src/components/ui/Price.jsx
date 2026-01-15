import React from 'react';
import './Price.css';

/**
 * Price - Reusable price display component with formatting
 * @param {number} amount - Price amount
 * @param {string} currency - Currency prefix (default: Rs.)
 * @param {string} className - Additional CSS classes
 */
const Price = ({ amount, currency = 'Rs.', className = '' }) => {
  const numeric = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  const formattedPrice = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);

  return (
    <div className={`price ${className}`}>
      <span className="price-currency">{currency}</span>
      <span className="price-amount">{formattedPrice}</span>
    </div>
  );
};

export default Price;
