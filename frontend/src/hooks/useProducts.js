import { useState, useEffect } from 'react';
import { get, post, patch, del } from '../utils/api';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get('/api/products');
        setProducts(response.products || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper to convert form data to FormData for backend
  const prepareFormData = (productData) => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key === 'image') {
        // If image is a base64 string, convert to blob
        if (productData[key] && productData[key].startsWith('data:image')) {
          const base64Data = productData[key].split(',')[1];
          const mimeType = productData[key].split(';')[0].split(':')[1];
          const blob = base64ToBlob(base64Data, mimeType);
          formData.append('image', blob, 'product-image.jpg');
        } else if (productData[key]) {
          formData.append(key, productData[key]);
        }
      } else if (productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });
    
    return formData;
  };

  // Helper to convert base64 to blob
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const addProduct = async (productData) => {
    try {
      const formData = prepareFormData(productData);
      const response = await post('/api/products/create', formData);
      
      const newProduct = response.data;
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const formData = prepareFormData(productData);
      const response = await patch(`/api/products/${productId}`, formData);
      
      const updatedProduct = response.data;
      setProducts(prev => prev.map(p => p._id === productId ? updatedProduct : p));
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await del(`/api/products/${productId}`);
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export default useProducts;

