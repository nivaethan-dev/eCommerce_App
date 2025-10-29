// Order calculation utilities
// Reuses cart calculation logic to avoid duplication

import { calculateCartSummary, CART_SUMMARY_CONFIG } from './cartSummaryUtils.js';

/**
 * Calculate order totals from cart summary
 * @param {Object} cartSummary - Cart summary object from calculateCartSummary
 * @returns {Object} Order totals with subTotal, tax, and totalAmount
 */
export const calculateOrderTotals = (cartSummary) => {
  if (!cartSummary) {
    return {
      subTotal: 0,
      tax: 0,
      totalAmount: 0
    };
  }

  const subTotal = cartSummary.subtotal;
  const tax = cartSummary.tax;
  const totalAmount = Math.round((subTotal + tax) * 100) / 100;

  return {
    subTotal: Math.round(subTotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    totalAmount: totalAmount
  };
};

/**
 * Calculate order totals from order items array
 * Used when items have been filtered/validated separately from cart
 * @param {Array} orderItems - Array of order items with price, quantity, subtotal
 * @returns {Object} Order totals with subTotal, tax, and totalAmount
 */
export const calculateOrderTotalsFromItems = (orderItems) => {
  if (!orderItems || orderItems.length === 0) {
    return {
      subTotal: 0,
      tax: 0,
      totalAmount: 0
    };
  }

  // Calculate subtotal from actual order items
  const subTotal = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  
  // Calculate tax using the same rate as cart
  const taxRate = CART_SUMMARY_CONFIG.TAX_RATE;
  const tax = Math.round((subTotal * taxRate) * 100) / 100;
  
  // Calculate total amount: subTotal + tax
  const totalAmount = Math.round((subTotal + tax) * 100) / 100;

  return {
    subTotal: Math.round(subTotal * 100) / 100,
    tax: tax,
    totalAmount: totalAmount
  };
};

/**
 * Calculate order totals directly from cart items
 * Convenience function that combines cart summary and order totals calculation
 * @param {Array} cartItems - Array of cart items with populated productId
 * @returns {Object} Order totals with subTotal, tax, and totalAmount
 */
export const calculateOrderTotalsFromCart = (cartItems) => {
  const cartSummary = calculateCartSummary(cartItems);
  return calculateOrderTotals(cartSummary);
};

