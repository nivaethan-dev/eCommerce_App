import React, { useState, useEffect } from 'react';
import OrderCard from '../components/Ordercard';
import './Order.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders from API
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.data || data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderNumber) => {
    console.log('View details for order:', orderNumber);
    // Navigate to order details page
    // window.location.href = `/orders/${orderNumber}`;
    // OR using React Router: navigate(`/orders/${orderNumber}`);
  };

  const handleTrackOrder = (orderNumber) => {
    console.log('Track order:', orderNumber);
    // Navigate to tracking page
    // window.location.href = `/orders/${orderNumber}/track`;
    // OR using React Router: navigate(`/orders/${orderNumber}/track`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Unable to load orders</h2>
          <p className="error-message">{error}</p>
          <button onClick={loadOrders} className="error-retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      {/* Header Section */}
      <div className="order-history-header">
        <div className="order-history-header-content">
          <h1 className="order-history-title">Order History</h1>
          <p className="order-history-subtitle">
            View and track your recent purchases. For assistance with any order, please contact our concierge service.
          </p>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="order-history-content">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h2 className="empty-state-title">No orders yet</h2>
            <p className="empty-state-message">Start shopping to see your orders here!</p>
            <button className="empty-state-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard
                key={order.orderNumber}
                order={{
                  ...order,
                  onViewDetails: handleViewDetails,
                  onTrack: handleTrackOrder
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="help-section">
        <div className="help-card">
          <h3 className="help-title">Need Help?</h3>
          <p className="help-description">
            If you have any questions about your orders, our customer service team is here to help.
          </p>
          <div className="help-links">
            <button className="help-link">Contact Support</button>
            <button className="help-link">Return Policy</button>
            <button className="help-link">Shipping Info</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;