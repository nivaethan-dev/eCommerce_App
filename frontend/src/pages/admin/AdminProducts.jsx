import { useState } from 'react';
import ProductGrid from '../../components/ProductGrid';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import useFormModal from '../../hooks/useFormModal';
import { mockProducts } from '../../data/mockProducts';

const AdminProducts = () => {
  // Using mock data for now - can easily be replaced with API call later
  const [products, setProducts] = useState(mockProducts);
  const { isOpen, openModal, closeModal } = useFormModal();

  const productFormFields = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Enter product name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Enter product description',
      rows: 4
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Fashion', label: 'Fashion' },
        { value: 'Home & Garden', label: 'Home & Garden' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Books', label: 'Books' }
      ]
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      nonNegative: true,
      step: '0.01',
      placeholder: '0.00'
    },
    {
      name: 'stock',
      label: 'Stock Quantity',
      type: 'number',
      required: true,
      nonNegative: true,
      placeholder: '0'
    },
    {
      name: 'image',
      label: 'Product Image',
      type: 'file',
      accept: 'image/*'
    }
  ];

  const handleAddProduct = (formData) => {
    const newProduct = {
      id: products.length + 1,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    closeModal();
    console.log('Product added:', newProduct);
  };

  return (
    <div>
      <PageHeader 
        title="Products"
        description="Manage your product inventory"
        actions={
          <Button variant="primary" onClick={openModal}>
            + Add Product
          </Button>
        }
      />
      
      <ProductGrid products={products} />

      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Product"
        fields={productFormFields}
        onSubmit={handleAddProduct}
        submitLabel="Add Product"
      />
    </div>
  );
};

export default AdminProducts;
