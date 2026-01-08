import { useState } from 'react';
import ProductGrid from '../../components/ProductGrid';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import ConfirmModal from '../../components/ConfirmModal';
import useFormModal from '../../hooks/useFormModal';
import useConfirmModal from '../../hooks/useConfirmModal';
import { mockProducts } from '../../data/mockProducts';

const AdminProducts = () => {
  // Using mock data for now - can easily be replaced with API call later
  const [products, setProducts] = useState(mockProducts);
  const { isOpen, openModal, closeModal } = useFormModal();
  const { 
    isOpen: isConfirmOpen, 
    openModal: openConfirmModal, 
    closeModal: closeConfirmModal,
    itemToDelete 
  } = useConfirmModal();

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

  const handleEditProduct = (product) => {
    console.log('Edit product:', product);
    // Edit functionality will be implemented later
  };

  const handleDeleteClick = (product) => {
    openConfirmModal(product);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setProducts(prev => prev.filter(p => p.id !== itemToDelete.id));
      console.log('Product deleted:', itemToDelete);
    }
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
      
      <ProductGrid 
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteClick}
      />

      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Product"
        fields={productFormFields}
        onSubmit={handleAddProduct}
        submitLabel="Add Product"
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AdminProducts;
