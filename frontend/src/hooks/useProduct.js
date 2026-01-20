import { useState, useEffect, useCallback } from 'react';
import { get } from '../utils/api';

/**
 * Custom hook to fetch a single product by ID
 * @param {string} productId - The ID of the product to fetch
 * @returns {Object} { product, loading, error, refresh }
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await get(`/api/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Failed to fetch product:', productId, err);
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refresh: fetchProduct
  };
};

export default useProduct;

