import { useState } from 'react';
import ProductGrid from '../../components/ProductGrid';
import { mockProducts } from '../../data/mockProducts';

const AdminProducts = () => {
  // Using mock data for now - can easily be replaced with API call later
  const [products] = useState(mockProducts);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Products</h1>
        <p style={{ margin: 0, color: '#666' }}>Manage your product inventory</p>
      </div>
      
      <ProductGrid products={products} />
    </div>
  );
};

export default AdminProducts;
