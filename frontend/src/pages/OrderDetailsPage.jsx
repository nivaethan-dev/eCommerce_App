import React from 'react';
import './OrderDetailsPage.css';
import { mockOrderDetails } from '../data/mockOrderDetails';
import OrderProgress from '../components/orderDetails/OrderProgress';
import ItemsOrdered from '../components/orderDetails/ItemsOrdered';
import OrderSummary from '../components/orderDetails/OrderSummary';


const OrderDetailsPage = () => {
  const orderData = mockOrderDetails;

  // Calculate totals
  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% tax
  const shipping = 10.00;
  const total = subtotal + tax + shipping;

  // Status color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      'Processing': '#f59e0b',
      'Shipped': '#3b82f6',
      'Delivered': '#10b981',
      'Cancelled': '#ef4444'
    };
    return statusColors[status] || '#6b7280';
  };

  return (
    <div className="order-details-page">
      {/* Header */}
      <div className="order-header">
        <div className="order-header-content">
          <button className="back-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Orders
          </button>
          <div className="order-title-section">
            <h1 className="order-title">Order Details</h1>
            <div className="order-meta">
              <span className="order-number">{orderData.orderNumber}</span>
              <span className="order-date">Placed on {orderData.orderDate}</span>
            </div>
          </div>
        </div>
        <div 
          className="order-status-badge"
          style={{ backgroundColor: getStatusColor(orderData.status) }}
        >
          {orderData.status}
        </div>
      </div>

      {/* Main Content */}
      <div className="order-content">
        {/* Left Column - Order Items */}
        <div className="order-main">
          <OrderProgress
            status={orderData.status}
            orderDate={orderData.orderDate}
            estimatedDelivery={orderData.estimatedDelivery}
          />

          <ItemsOrdered items={orderData.items} />
        </div>

        {/* Right Column - Order Summary & Details */}
        <div className="order-sidebar">
          <OrderSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
            taxRateLabel="Tax (15%)"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;