import { useState } from 'react';
import ProductGrid from '../../components/ProductGrid';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import { mockProducts } from '../../data/mockProducts';

const AdminProducts = () => {
  // Using mock data for now - can easily be replaced with API call later
  const [products] = useState(mockProducts);

  const handleAddProduct = () => {
    // Add product functionality will be implemented later
    console.log('Add product clicked');
  };

  return (
    <div>
      <PageHeader 
        title="Products"
        description="Manage your product inventory"
        actions={
          <Button variant="primary" onClick={handleAddProduct}>
            + Add Product
          </Button>
        }
      />
      
      <ProductGrid products={products} />
    </div>
  );
};

export default AdminProducts;
