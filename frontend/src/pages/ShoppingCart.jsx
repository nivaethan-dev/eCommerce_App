import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShoppingCart.css';
import { mockCartItems } from '../data/mockCartData';
import CartPageHeader from '../components/cart/CartPageHeader';
import CartEmptyState from '../components/cart/CartEmptyState';
import CartItemList from '../components/cart/CartItemList';
import CartOrderSummary from '../components/cart/CartOrderSummary';

// --- Shopping Cart Component (Reusable) ---
const ShoppingCart = ({ 
  initialCartItems = mockCartItems,
  onCheckout,
  onContinueShopping
}) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');

  // Default handlers
  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      navigate('/products');
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      console.log('Proceeding to checkout...');
      // TODO: Implement checkout flow
    }
  };

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

  const formatCurrency = (amount) =>
    `Rs. ${new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      Number.isFinite(amount) ? amount : 0
    )}`;

  const handleApplyPromo = () => {
    // Promo code is already being used in the useMemo above
    // This function can trigger a notification or animation
  };

  return (
    <div className="shopping-page">
      {/* --- PAGE HEADER --- */}
      <CartPageHeader itemsCount={itemsCount} />

      {/* Back Link */}
      <div className="back-link-wrapper">
        <div className="back-link" onClick={handleContinueShopping}>
          &#x2190; Continue Shopping
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="layout-container">
        {/* Cart Section */}
        <div className="cart-section">
          <div className="shopping-cart-container">
            {cartItems.length === 0 ? (
              <CartEmptyState onContinueShopping={handleContinueShopping} />
            ) : (
              <CartItemList
                items={cartItems}
                itemsCount={itemsCount}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                formatCurrency={formatCurrency}
              />
            )}
          </div>
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <CartOrderSummary
            itemsCount={itemsCount}
            subtotal={subtotal}
            discountRate={discountRate}
            discountAmount={discountAmount}
            total={total}
            formatCurrency={formatCurrency}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            onApplyPromo={handleApplyPromo}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;