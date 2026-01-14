import { useEffect, useState } from 'react';
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
import ToastStack from '../../components/ToastStack';
import useToasts from '../../hooks/useToasts';
import Pagination from '../../components/Pagination';
import { get } from '../../utils/api';

const AdminProducts = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Use the hook only for mutations; list rendering is server-paginated.
  const { addProduct, updateProduct, deleteProduct } = useProducts({ skipFetch: true });
  const { isOpen: isAddOpen, openModal: openAddModal, closeModal: closeAddModal } = useFormModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useFormModal();
  const { 
    isOpen: isConfirmOpen, 
    openModal: openConfirmModal, 
    closeModal: closeConfirmModal,
    itemToDelete 
  } = useConfirmModal();

  const { toasts, push, dismiss } = useToasts();

  // UI reflect (backend is the source of truth)
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = async (p = page) => {
    try {
      setLoading(true);
      setError(null);
      const res = await get(`/api/products?page=${p}&limit=5`);
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(typeof res.total === 'number' ? res.total : (res.products || []).length);
    } catch (e) {
      setError(e?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleAddProduct = async (formData) => {
    await addProduct(formData);
    closeAddModal();
    setPage(1);
    await fetchPage(1);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    openEditModal();
  };

  const handleUpdateProduct = async (formData) => {
    await updateProduct(editingProduct?._id || editingProduct?.id, formData);
    setEditingProduct(null);
    closeEditModal();
    await fetchPage(page);
  };

  const handleDeleteClick = (product) => {
    openConfirmModal(product);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await deleteProduct(itemToDelete?._id || itemToDelete?.id);
      await fetchPage(page);
    }
  };

  return (
    <div>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <PageHeader 
        title="Products"
        description="Manage your product inventory"
        actions={
          <Button variant="primary" onClick={openAddModal} disabled={!isAdmin} title={!isAdmin ? 'Admins only' : undefined}>
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
        <>
          <ProductGrid 
            products={products}
          onEdit={isAdmin ? handleEditClick : undefined}
          onDelete={isAdmin ? handleDeleteClick : undefined}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={5}
            totalItems={totalItems}
          />
        </>
      )}

      <FormModal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        title="Add New Product"
        fields={addProductFields}
        onSubmit={handleAddProduct}
        onSuccess={() => push({ type: 'success', title: 'Created', message: 'Product added successfully.' })}
        onError={(e) => push({ type: 'error', title: 'Create failed', message: e?.message || 'Failed to add product.' })}
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
        onSuccess={() => push({ type: 'success', title: 'Updated', message: 'Product updated successfully.' })}
        onError={(e) => push({ type: 'error', title: 'Update failed', message: e?.message || 'Failed to update product.' })}
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
