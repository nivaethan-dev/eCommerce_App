// Cart summary calculation utilities
// This file handles all cart summary calculations and business logic

// Cart summary calculation constants
export const CART_SUMMARY_CONFIG = {
  TAX_RATE: 0.08, // 8% tax rate
  CURRENCY: 'LKR',
  CURRENCY_SYMBOL: 'Rs.'
};

// Helper function to calculate cart summary
export const calculateCartSummary = (cart) => {
  if (!cart || cart.length === 0) {
    return {
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
      currency: CART_SUMMARY_CONFIG.CURRENCY,
      currencySymbol: CART_SUMMARY_CONFIG.CURRENCY_SYMBOL,
      taxRate: CART_SUMMARY_CONFIG.TAX_RATE
    };
  }

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => {
    if (item.productId && item.productId.price) {
      return sum + (item.productId.price * item.quantity);
    }
    return sum;
  }, 0);

  // Calculate tax
  const tax = subtotal * CART_SUMMARY_CONFIG.TAX_RATE;

  // Calculate total (subtotal + tax only)
  const total = subtotal + tax;

  // Calculate item count
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
    currency: CART_SUMMARY_CONFIG.CURRENCY,
    currencySymbol: CART_SUMMARY_CONFIG.CURRENCY_SYMBOL,
    taxRate: CART_SUMMARY_CONFIG.TAX_RATE
  };
};

// Helper function to format currency
export const formatCurrency = (amount, currency = CART_SUMMARY_CONFIG.CURRENCY) => {
  const symbol = CART_SUMMARY_CONFIG.CURRENCY_SYMBOL;
  return `${symbol}${amount.toFixed(2)}`;
};

