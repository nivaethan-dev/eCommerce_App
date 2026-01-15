import React from 'react';

const CartPromoSection = ({ promoCode, setPromoCode, onApplyPromo }) => (
  <div className="summary-section promo-section">
    <label htmlFor="promo">Promo Code</label>
    <div className="promo-input-group">
      <input
        id="promo"
        type="text"
        className="input-field promo-input"
        placeholder="Enter code"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />
      <button className="apply-promo-btn" onClick={onApplyPromo}>
        Apply
      </button>
    </div>
    <div className="promo-hint">Try: SAVE10 for 10% off</div>
  </div>
);

export default CartPromoSection;

