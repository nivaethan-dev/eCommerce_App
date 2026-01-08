import { useState } from 'react';

const useProducts = (initialProducts = []) => {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (productData) => {
    const newProduct = {
      id: products.length + 1,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, productData) => {
    const updatedProduct = {
      ...productData,
      id: productId,
      createdAt: products.find(p => p.id === productId)?.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
    return updatedProduct;
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export default useProducts;

