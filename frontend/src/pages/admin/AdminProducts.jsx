import { useState } from 'react';
import ProductGrid from '../../components/ProductGrid';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import FormModal from '../../components/FormModal';
import EditModal from '../../components/EditModal';
import ConfirmModal from '../../components/ConfirmModal';
import useFormModal from '../../hooks/useFormModal';
import useConfirmModal from '../../hooks/useConfirmModal';
import useProducts from '../../hooks/useProducts';
import { addProductFields, editProductFields } from '../../config/productFormConfig';

const AdminProducts = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const { isOpen: isAddOpen, openModal: openAddModal, closeModal: closeAddModal } = useFormModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useFormModal();
  const { 
    isOpen: isConfirmOpen, 
    openModal: openConfirmModal, 
    closeModal: closeConfirmModal,
    itemToDelete 
  } = useConfirmModal();

  const handleAddProduct = (formData) => {
    addProduct(formData);
    closeAddModal();
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    openEditModal();
  };

  const handleUpdateProduct = (formData) => {
    updateProduct(editingProduct.id, formData);
    setEditingProduct(null);
    closeEditModal();
  };

  const handleDeleteClick = (product) => {
    openConfirmModal(product);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteProduct(itemToDelete.id);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Products"
        description="Manage your product inventory"
        actions={
          <Button variant="primary" onClick={openAddModal}>
            + Add Product
          </Button>
        }
      />

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Loading products...
        </div>
      )}

      {error && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#f44336' }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <ProductGrid 
          products={products}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <FormModal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        title="Add New Product"
        fields={addProductFields}
        onSubmit={handleAddProduct}
        submitLabel="Add Product"
      />

      <EditModal
        isOpen={isEditOpen}
        onClose={() => {
          setEditingProduct(null);
          closeEditModal();
        }}
        title="Edit Product"
        data={editingProduct}
        fields={editProductFields}
        onSubmit={handleUpdateProduct}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${itemToDelete?.title || itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AdminProducts;
