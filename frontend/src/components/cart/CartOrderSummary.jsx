import React from 'react';
import CartPromoSection from './CartPromoSection';

const CartOrderSummary = ({
  itemsCount,
  subtotal,
  discountRate,
  discountAmount,
  total,
  formatCurrency,
  promoCode,
  setPromoCode,
  onApplyPromo,
  onCheckout,
}) => (
  <div className="summary-container">
    <h3 className="summary-header">Order Summary</h3>

    <div className="summary-breakdown">
      <div className="summary-line">
        <span>Subtotal ({itemsCount} items)</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {discountRate > 0 && (
        <div className="summary-line discount-line">
          <span>Discount ({discountRate * 100}% off)</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      )}
    </div>

    {/*
    <CartPromoSection
      promoCode={promoCode}
      setPromoCode={setPromoCode}
      onApplyPromo={onApplyPromo}
    />
    */}

    <div className="summary-total">
      <span className="total-label">Total</span>
      <span className="total-value">{formatCurrency(total)}</span>
    </div>

    <button className="checkout-button" onClick={onCheckout}>
      Proceed to Checkout
    </button>
  </div>
);

export default CartOrderSummary;

