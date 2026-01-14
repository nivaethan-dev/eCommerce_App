import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import { post } from '../../utils/api';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductActions from './components/ProductActions';
import './ProductDetails.css';

/**
 * ProductDetails Page - Modularized product view page
 */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { product, loading, error } = useProduct(id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const getReturnTo = () =>
    `${location.pathname}${location.search || ''}${location.hash || ''}`;

  const redirectToLogin = () => {
    const returnTo = getReturnTo();
    navigate(`/login?redirect=${encodeURIComponent(returnTo)}`);
  };

  const handleAddToCart = async (quantity) => {
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole');
      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }
      // Admins should not use customer cart flows
      if (userRole === 'admin') {
        navigate('/404');
        return;
      }

      setIsProcessing(true);
      setActionError(null);
      setActionSuccess(null);
      
      await post('/api/customers/cart/items', { 
        productId: product._id, 
        quantity 
      });
      
      setActionSuccess(`Added ${quantity} item(s) to your cart!`);
      // Dispatch event to refresh cart count in header
      window.dispatchEvent(new Event('cartChange'));
    } catch (err) {
      console.error('Failed to add to cart:', err);
      if (typeof err?.message === 'string' && err.message.includes('status: 401')) {
        redirectToLogin();
        return;
      }
      setActionError(err.message || 'Failed to add item to cart. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyNow = async (quantity) => {
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole');
      if (!isAuthenticated) {
        redirectToLogin();
        return;
      }
      // Admins should not use customer cart/order flows
      if (userRole === 'admin') {
        navigate('/404');
        return;
      }

      setIsProcessing(true);
      setActionError(null);
      
      const response = await post('/api/customers/orders', { 
        items: [{ productId: product._id, quantity }] 
      });
      
      // If success, redirect to orders or a success page
      navigate('/orders', { 
        state: { 
          message: 'Order placed successfully!',
          orderId: response.order?._id
        } 
      });
    } catch (err) {
      console.error('Failed to place direct order:', err);
      if (typeof err?.message === 'string' && err.message.includes('status: 401')) {
        redirectToLogin();
        return;
      }
      setActionError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page loading">
        <div className="container">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page error">
        <div className="container">
          <h2>Error</h2>
          <p>{error || 'Product not found'}</p>
          <Link to="/products" className="back-link">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <Link to={`/products/category/${encodeURIComponent(product.category)}`}>{product.category}</Link> / {product.title}
        </div>

        {actionError && <div className="action-message error">{actionError}</div>}
        {actionSuccess && <div className="action-message success">{actionSuccess}</div>}

        <div className="product-details-grid">
          <ProductGallery image={product.image} name={product.title} />
          
          <div className="product-sidebar">
            <ProductInfo 
              title={product.title}
              description={product.description}
              category={product.category}
              price={product.price}
            />
            
            <ProductActions 
              stock={product.stock}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

