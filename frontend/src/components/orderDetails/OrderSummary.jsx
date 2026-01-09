import React from 'react';

export default function OrderSummary({ subtotal, tax, shipping, total, taxRateLabel = 'Tax' }) {
  return (
    <div className="summary-card">
      <h2 className="card-title">Order Summary</h2>
      <div className="summary-rows">
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{taxRateLabel}</span>
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
  );
}


