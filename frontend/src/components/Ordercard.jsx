import React from 'react';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '✓';
      case 'processing':
        return '◷';
      case 'shipped':
        return '→';
      case 'cancelled':
        return '✕';
      default:
        return '•';
    }
  };

  return (
    <div className="order-card">
      {/* Header Section */}
      <div className="order-card-header">
        <div className="order-card-header-info">
          <div className="order-info-block">
            <p className="order-info-label">Order No.</p>
            <p className="order-info-value order-number">#{order.orderNumber}</p>
          </div>
          <div className="order-info-block">
            <p className="order-info-label">Placed On</p>
            <p className="order-info-value order-date">{order.placedOn}</p>
          </div>
        </div>
        <div className={`order-status ${getStatusColor(order.status)}`}>
          <span className="order-status-icon">{getStatusIcon(order.status)}</span>
          <span>{order.status}</span>
        </div>
      </div>

      {/* Product Items Section */}
      <div className="order-card-items">
        <div className="order-items-container">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="order-item-image-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="order-item-image"
                />
              </div>
              <p className="order-item-name">{item.name}</p>
              <p className="order-item-price">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="order-card-footer">
        <div className="order-total-section">
          <p className="order-total-label">Total Amount</p>
          <p className="order-total-amount">${order.totalAmount.toFixed(2)}</p>
        </div>
        <div className="order-actions">
          <button
            onClick={() => order.onViewDetails && order.onViewDetails(order.orderNumber)}
            className="order-btn order-btn-primary"
          >
            VIEW DETAILS
            <span>→</span>
          </button>
          <button
            onClick={() => order.onTrack && order.onTrack(order.orderNumber)}
            className="order-btn order-btn-secondary"
          >
            TRACK ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;