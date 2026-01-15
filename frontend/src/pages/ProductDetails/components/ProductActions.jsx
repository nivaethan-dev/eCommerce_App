import React, { useState } from 'react';

/**
 * ProductActions component - Handles quantity selection, Add to Cart, and Buy It Now
 */
const ProductActions = ({ stock, onAddToCart, onBuyNow, isProcessing }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) return;
    if (val > stock) {
      setQuantity(stock);
    } else {
      setQuantity(val);
    }
  };

  const isOutOfStock = stock <= 0;

  return (
    <div className="product-actions-section">
      <div className="product-quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <div className="quantity-controls">
          <button 
            type="button" 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
          >
            -
          </button>
          <input
            id="quantity"
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isOutOfStock}
          />
          <button 
            type="button" 
            onClick={() => setQuantity(q => Math.min(stock, q + 1))}
            disabled={quantity >= stock || isOutOfStock}
          >
            +
          </button>
        </div>
        <span className="stock-status">
          {isOutOfStock ? (
            <span className="out-of-stock">Out of Stock</span>
          ) : (
            <span className="in-stock">{stock} items available</span>
          )}
        </span>
      </div>

      <div className="product-action-buttons">
        <button
          className="buy-now-btn"
          onClick={() => onBuyNow(quantity)}
          disabled={isOutOfStock || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Buy It Now'}
        </button>
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(quantity)}
          disabled={isOutOfStock || isProcessing}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductActions;

