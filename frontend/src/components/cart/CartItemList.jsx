import React from 'react';
import CartItemRow from './CartItemRow';

const CartItemList = ({ items, itemsCount, updateQuantity, removeItem, formatCurrency }) => (
  <>
    <h2 className="shopping-cart-header">
      Items <span className="shopping-item-count-badge">{itemsCount}</span>
    </h2>
    {items.map((item) => (
      <CartItemRow
        key={item.id}
        item={item}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        formatCurrency={formatCurrency}
      />
    ))}
  </>
);

export default CartItemList;

