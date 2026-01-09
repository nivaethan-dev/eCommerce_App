import React from 'react';

export default function ItemsOrdered({ items }) {
  return (
    <div className="items-section">
      <h2 className="section-title">Items Ordered</h2>
      <div className="order-items">
        {items.map((item) => (
          <div key={item.id} className="order-item-card">
            <div className="item-image-wrapper">
              <img
                src={item.image}
                alt={item.name}
                className="item-image"
                loading="lazy"
              />
              <span className="item-category">{item.category}</span>
            </div>
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-meta">
                <span className="item-quantity">Qty: {item.quantity}</span>
                <span className="item-price">${item.price.toFixed(2)} each</span>
              </div>
            </div>
            <div className="item-total">
              <span className="item-total-label">Total</span>
              <span className="item-total-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


