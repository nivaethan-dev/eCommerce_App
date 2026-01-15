import React from 'react';

const CartEmptyState = ({ onContinueShopping }) => (
  <div className="shopping-empty-cart">
    <p>Your cart is empty</p>
    <button onClick={onContinueShopping} className="shopping-continue-shopping-btn">
      Start Shopping
    </button>
  </div>
);

export default CartEmptyState;

