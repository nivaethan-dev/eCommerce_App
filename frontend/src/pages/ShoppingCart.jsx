import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ShoppingCart.css';
import CartPageHeader from '../components/cart/CartPageHeader';
import CartEmptyState from '../components/cart/CartEmptyState';
import CartItemList from '../components/cart/CartItemList';
import CartOrderSummary from '../components/cart/CartOrderSummary';
import { get, put, del, post } from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';

// --- Shopping Cart Component (Reusable) ---
const ShoppingCart = ({ 
  initialCartItems = [],
  onCheckout,
  onContinueShopping
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Default handlers
  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      navigate('/products');
    }
  };

  const getReturnTo = useCallback(
    () => `${location.pathname}${location.search || ''}${location.hash || ''}`,
    [location.pathname, location.search, location.hash]
  );

  const redirectToLogin = useCallback(() => {
    const returnTo = getReturnTo();
    navigate(`/login?redirect=${encodeURIComponent(returnTo)}`);
  }, [getReturnTo, navigate]);

  const isAuthError = useCallback((err) => {
    const message = typeof err?.message === 'string' ? err.message : '';
    return message.includes('status: 401') || message.toLowerCase().includes('unauthorized');
  }, []);

  const parseCartError = useCallback((err) => {
    const message = typeof err?.message === 'string' ? err.message : '';
    const lower = message.toLowerCase();

    if (!message) {
      return { title: 'Something went wrong', detail: 'Please try again.' };
    }

    if (lower.includes('failed to fetch') || lower.includes('network')) {
      return {
        title: 'Network error',
        detail: 'Unable to reach the server. Please check that the backend is running.',
      };
    }

    if (lower.includes('out of stock')) {
      return { title: 'Out of stock', detail: message };
    }

    if (lower.includes('available in stock')) {
      return { title: 'Insufficient stock', detail: message };
    }

    if (lower.includes('product not found in cart')) {
      return { title: 'Cart item missing', detail: message };
    }

    if (lower.includes('product not found')) {
      return { title: 'Product unavailable', detail: message };
    }

    if (lower.includes('quantity must be at least') || lower.includes('quantity cannot be negative')) {
      return { title: 'Invalid quantity', detail: message };
    }

    return { title: 'Request failed', detail: message };
  }, []);

  const handleCheckout = async () => {
    if (onCheckout) {
      onCheckout();
      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutMessage('');
      setCartError(null);
      const response = await post('/api/customers/orders', {});
      await fetchCart();
      window.dispatchEvent(new Event('cartChange'));
      setCheckoutMessage(
        response?.order?._id
          ? `Order placed successfully! Order ID: ${response.order._id}`
          : 'Order placed successfully!'
      );
    } catch (err) {
      if (isAuthError(err)) {
        redirectToLogin();
        return;
      }
      setCartError(parseCartError(err));
    } finally {
      setIsCheckingOut(false);
    }
  };

  const normalizeCartItems = useCallback((items = []) => (
    items.map((item) => {
      const product = item?.productId && typeof item.productId === 'object'
        ? item.productId
        : null;
      const productId = product?._id || item?.productId || item?._id || item?.id;
      const imageUrl = product?.image && typeof product.image === 'string' && product.image.startsWith('http')
        ? product.image
        : 'https://via.placeholder.com/80';

      return {
        id: String(productId || ''),
        name: product?.title || product?.name || item?.name || 'Product',
        category: product?.category || item?.category || '',
        price: Number(product?.price ?? item?.price ?? 0),
        quantity: Number(item?.quantity ?? 0),
        imageUrl,
      };
    }).filter((item) => item.id)
  ), []);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setCartError(null);
    try {
      const cartData = await get(API_ENDPOINTS.CART);
      const items = Array.isArray(cartData?.items)
        ? cartData.items
        : Array.isArray(cartData?.cart)
          ? cartData.cart
          : [];
      setCartItems(normalizeCartItems(items));
    } catch (err) {
      if (isAuthError(err)) {
        redirectToLogin();
        return;
      }
      setCartError(parseCartError(err));
    } finally {
      setIsLoading(false);
    }
  }, [normalizeCartItems, isAuthError, redirectToLogin, parseCartError]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleCartChange = () => {
      fetchCart();
    };
    window.addEventListener('cartChange', handleCartChange);
    return () => {
      window.removeEventListener('cartChange', handleCartChange);
    };
  }, [fetchCart]);

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

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await put(`/api/customers/cart/items/${id}`, { quantity: newQuantity });
      await fetchCart();
      window.dispatchEvent(new Event('cartChange'));
    } catch (err) {
      if (isAuthError(err)) {
        redirectToLogin();
        return;
      }
      setCartError(parseCartError(err));
    }
  };

  const removeItem = async (id) => {
    try {
      await del(API_ENDPOINTS.CART_REMOVE(id));
      await fetchCart();
      window.dispatchEvent(new Event('cartChange'));
    } catch (err) {
      if (isAuthError(err)) {
        redirectToLogin();
        return;
      }
      setCartError(parseCartError(err));
    }
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
            {checkoutMessage && (
              <div className="shopping-empty-cart">
                <p>{checkoutMessage}</p>
              </div>
            )}
            {cartError ? (
              <div className="shopping-empty-cart">
                <p>{cartError.title}</p>
                {cartError.detail && <p>{cartError.detail}</p>}
              </div>
            ) : isLoading ? (
              <div className="shopping-empty-cart">
                <p>Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
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
            isCheckingOut={isCheckingOut}
          />
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;