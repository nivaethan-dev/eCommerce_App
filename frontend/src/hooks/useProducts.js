import { useState, useEffect } from 'react';
import { mockProducts, categories, groupProductsByCategory } from '../data/mockProducts';
// import { get } from '../utils/api'; // Uncomment when backend is ready

/**
 * Custom hook for fetching and managing products
 * @returns {Object} { products, categories, loading, error }
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual API call when backend is ready
        // const data = await get('/api/products');
        // setProducts(data);
        
        // For now, use mock data with a simulated delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productsByCategory = groupProductsByCategory(products);

  return {
    products,
    productsByCategory,
    categories,
    loading,
    error
  };
};

