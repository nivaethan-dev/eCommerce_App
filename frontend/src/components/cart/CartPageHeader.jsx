import React from 'react';

const CartPageHeader = ({ itemsCount }) => (
  <div className="page-header-centered">
    <h1 className="page-title">Shopping Cart</h1>
    <p className="page-subtitle">
      {itemsCount} {itemsCount === 1 ? 'item' : 'items'} in your cart
    </p>
  </div>
);

export default CartPageHeader;

