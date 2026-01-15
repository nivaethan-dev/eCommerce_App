import React from 'react';
import { getItemImage } from '../../data/mockCartData';

const CartItemRow = ({ item, updateQuantity, removeItem, formatCurrency }) => {
  const itemPrice = parseFloat(item.price);
  const totalPrice = itemPrice * item.quantity;
  const formattedPrice = formatCurrency(itemPrice);

  return (
    <div className="shopping-cart-item">
      <img src={getItemImage(item)} alt={item.name} className="item-image" />

      <div className="item-details-and-controls-left">
        <div className="item-details-top">
          <div className="name">{item.name}</div>
          <div className="category">{item.category}</div>
        </div>

        <div className="quantity-controls-wrapper-left">
          <div className="quantity-controls">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="quantity-button minus"
            >
              -
            </button>
            <input type="text" readOnly value={item.quantity} className="quantity-input" />
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="quantity-button plus"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="item-action-stack-right">
        <div className="item-price-info">
          <div className="price-each">{formattedPrice} each</div>
          <div className="price-total">{formatCurrency(totalPrice)}</div>
        </div>
        <button onClick={() => removeItem(item.id)} className="remove-button-right">
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;

