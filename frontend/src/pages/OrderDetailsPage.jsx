import React from 'react';
import './OrderDetailsPage.css';


const OrderDetailsPage = () => {
  // Sample order data
  const orderData = {
    orderNumber: '#ORD-129600',
    orderDate: 'October 29, 2025',
    status: 'Processing',
    estimatedDelivery: 'November 5, 2025',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+94 77 123 4567'
    },
    shippingAddress: {
      street: '123 Main Street',
      city: 'Colombo',
      province: 'Western Province',
      postalCode: '00100',
      country: 'Sri Lanka'
    },
    billingAddress: {
      street: '123 Main Street',
      city: 'Colombo',
      province: 'Western Province',
      postalCode: '00100',
      country: 'Sri Lanka'
    },
    items: [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        price: 89.99,
        quantity: 1,
        category: 'Electronics'
      },
      {
        id: 2,
        name: 'Yoga Mat Premium',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
        price: 49.99,
        quantity: 2,
        category: 'Sports'
      },
      {
        id: 3,
        name: 'Ceramic Plant Pot Set',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop',
        price: 39.99,
        quantity: 1,
        category: 'Home & Garden'
      }
    ],
    payment: {
      method: 'Credit Card',
      cardType: 'Visa',
      lastFourDigits: '4242'
    }
  };

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
          {/* Progress Tracker */}
          <div className="progress-section">
            <h2 className="section-title">Order Progress</h2>
            <div className="progress-tracker">
              <div className="progress-step completed">
                <div className="step-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="step-info">
                  <p className="step-label">Order Placed</p>
                  <p className="step-date">Oct 29, 2025</p>
                </div>
              </div>
              <div className="progress-line active"></div>
              <div className="progress-step active">
                <div className="step-icon">
                  <div className="pulse"></div>
                </div>
                <div className="step-info">
                  <p className="step-label">Processing</p>
                  <p className="step-date">In Progress</p>
                </div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-icon"></div>
                <div className="step-info">
                  <p className="step-label">Shipped</p>
                  <p className="step-date">Pending</p>
                </div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-icon"></div>
                <div className="step-info">
                  <p className="step-label">Delivered</p>
                  <p className="step-date">Est. Nov 5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="items-section">
            <h2 className="section-title">Items Ordered</h2>
            <div className="order-items">
              {orderData.items.map((item, index) => (
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
        </div>

        {/* Right Column - Order Summary & Details */}
        <div className="order-sidebar">
          {/* Order Summary */}
          <div className="summary-card">
            <h2 className="card-title">Order Summary</h2>
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax (15%)</span>
                <span className="summary-value">${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span className="summary-label">Total</span>
                <span className="summary-value">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="info-card">
            <h2 className="card-title">Customer Information</h2>
            <div className="info-content">
              <div className="info-item">
                <svg className="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <p className="info-label">Name</p>
                  <p className="info-value">{orderData.customer.name}</p>
                </div>
              </div>
              <div className="info-item">
                <svg className="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 5l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">{orderData.customer.email}</p>
                </div>
              </div>
              <div className="info-item">
                <svg className="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 2v4M13 2v4M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <p className="info-label">Phone</p>
                  <p className="info-value">{orderData.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="info-card">
            <h2 className="card-title">Shipping Address</h2>
            <div className="address-content">
              <p>{orderData.shippingAddress.street}</p>
              <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.province}</p>
              <p>{orderData.shippingAddress.postalCode}</p>
              <p>{orderData.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="info-card">
            <h2 className="card-title">Payment Method</h2>
            <div className="payment-content">
              <div className="payment-method">
                <svg className="payment-icon" width="32" height="24" viewBox="0 0 32 24" fill="none">
                  <rect width="32" height="24" rx="4" fill="#667eea"/>
                  <rect x="2" y="8" width="28" height="3" fill="white" opacity="0.8"/>
                  <rect x="2" y="14" width="12" height="2" rx="1" fill="white" opacity="0.6"/>
                </svg>
                <div>
                  <p className="payment-label">{orderData.payment.cardType} •••• {orderData.payment.lastFourDigits}</p>
                  <p className="payment-type">{orderData.payment.method}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;