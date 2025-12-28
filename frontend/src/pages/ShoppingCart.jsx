import React, { useState, useMemo } from 'react';
import './ShoppingCart.css'; 

// --- Dummy image utility ---
const getItemImage = (name) => {
  if (name.includes('Headphones')) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlQq83LWgPlGcW36AlKW0sIOfrRjft-v8yvQ&s';
  if (name.includes('Shoes')) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8dGGAFkudYQ5dt4POjzYmxEXl0fPWdpiEnA&s';
  if (name.includes('Yoga')) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVqialCkeipNjrAGU5WMnIhIwmsvccVCbqJw&s';
};

// --- Individual Cart Item ---
const CartItem = ({ item, updateQuantity, removeItem }) => {
  const itemPrice = parseFloat(item.price);
  const totalPrice = (itemPrice * item.quantity).toFixed(2);
  const formattedPrice = `$${itemPrice.toFixed(2)}`;

  return (
    <div className="cart-item">
      <img src={getItemImage(item.name)} alt={item.name} className="item-image" />

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

// --- Shopping Cart ---
const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: '79.99', quantity: 1 },
    { id: 2, name: 'Running Shoes', category: 'Footwear', price: '89.99', quantity: 2 },
    { id: 3, name: 'Yoga Mat', category: 'Sports', price: '29.99', quantity: 1 },
  ]);
  const [promoCode, setPromoCode] = useState('');
  const shippingCost = 10.0;

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0),
    [cartItems]
  );

  const { total, discountAmount, discountRate, itemsCount } = useMemo(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const discountRateCalc = promoCode.toUpperCase() === 'SAVE10' ? 0.1 : 0;
    const discount = subtotal * discountRateCalc;
    const finalTotal = subtotal + shippingCost - discount;
    return { total: finalTotal, discountAmount: discount, discountRate: discountRateCalc, itemsCount: count };
  }, [subtotal, promoCode, shippingCost, cartItems]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  return (
    <div className="shopping-page">
      {/* --- CENTERED PAGE HEADER --- */}
      <div className="page-header-centered">
        <h1 className="page-title">Cart</h1>
        <p className="page-subtitle">Welcome to the cart page</p>
      </div>

      {/* --- STACKED CART + SUMMARY --- */}
      <div className="layout-container stacked">
        {/* Cart Section */}
        <div className="cart-section">
          <div className="back-link">&#x2190; Continue Shopping</div>
          <div className="cart-container">
            <h2 className="cart-header">
              Shopping Cart <span className="item-count-text">{itemsCount} Items</span>
            </h2>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="summary-container">
          <h3 className="summary-header">Order Summary</h3>

          <div className="summary-section subtotal-line">
            <span>Items {itemsCount}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="summary-section">
            <label htmlFor="shipping">Shipping Method</label>
            <select id="shipping" className="input-field shipping-select">
              <option value="standard">Standard Shipping - {formatCurrency(shippingCost)}</option>
            </select>
          </div>

          <div className="summary-breakdown">
            <div className="summary-line"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            {discountRate > 0 && (
              <div className="summary-line discount-line">
                <span>Discount ({discountRate * 100}%)</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="summary-line"><span>Shipping</span><span>{formatCurrency(shippingCost)}</span></div>
          </div>

          <div className="summary-total">
            <span className="total-label">Total</span>
            <span className="total-value">{formatCurrency(total)}</span>
          </div>

          <button className="checkout-button">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
