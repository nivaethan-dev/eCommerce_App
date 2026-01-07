import React, { useState, useMemo } from 'react';
import './ShoppingCart.css'; 
import { mockCartItems, getItemImage } from '../data/mockCartData';

// --- Individual Cart Item ---
const CartItem = ({ item, updateQuantity, removeItem }) => {
  const itemPrice = parseFloat(item.price);
  const totalPrice = (itemPrice * item.quantity).toFixed(2);
  const formattedPrice = `$${itemPrice.toFixed(2)}`;

  return (
    <div className="cart-item">
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
            <input
              type="text"
              readOnly
              value={item.quantity}
              className="quantity-input"
            />
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
          <div className="price-total">${totalPrice}</div>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="remove-button-right"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

// --- Shopping Cart Component (Reusable) ---
const ShoppingCart = ({ 
  initialCartItems = mockCartItems,
  onCheckout = () => console.log('Checkout clicked'),
  onContinueShopping = () => console.log('Continue shopping clicked')
}) => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0),
    [cartItems]
  );

  const { total, discountAmount, discountRate, itemsCount } = useMemo(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const discountRateCalc = promoCode.toUpperCase() === 'SAVE10' ? 0.1 : 0;
    const discount = subtotal * discountRateCalc;
    const finalTotal = subtotal - discount;
    return { total: finalTotal, discountAmount: discount, discountRate: discountRateCalc, itemsCount: count };
  }, [subtotal, promoCode, cartItems]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const handleApplyPromo = () => {
    // Promo code is already being used in the useMemo above
    // This function can trigger a notification or animation
  };

  return (
    <div className="shopping-page">
      {/* --- PAGE HEADER --- */}
      <div className="page-header-centered">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">{itemsCount} {itemsCount === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="layout-container">
        {/* Cart Section */}
        <div className="cart-section">
          <div className="back-link" onClick={onContinueShopping}>
            &#x2190; Continue Shopping
          </div>
          
          <div className="cart-container">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button onClick={onContinueShopping} className="continue-shopping-btn">
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <h2 className="cart-header">
                  Items <span className="item-count-badge">{itemsCount}</span>
                </h2>
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem} />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
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
                <button 
                  className="apply-promo-btn" 
                  onClick={handleApplyPromo}
                >
                  Apply
                </button>
              </div>
              <div className="promo-hint">Try: SAVE10 for 10% off</div>
            </div>

            <div className="summary-total">
              <span className="total-label">Total</span>
              <span className="total-value">{formatCurrency(total)}</span>
            </div>

            <button className="checkout-button" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
