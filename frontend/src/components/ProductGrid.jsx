import IconButton from './IconButton';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';

const ProductGrid = ({ products = [], onEdit, onDelete }) => {
  // Helper to get full image URL
  const getImageUrl = (imagePath) => {
    // Use a real placeholder image (no text) if missing
    if (!imagePath) return 'https://via.placeholder.com/50';
    // Remote-only images (Cloudinary/etc.). Do NOT render local upload paths from the machine.
    if (
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('data:')
    ) {
      return imagePath;
    }
    return 'https://via.placeholder.com/50';
  };

  return (
    <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Image</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Product Name</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Description</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Category</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Price</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Stock</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Created At</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#333' }}>Updated At</th>
            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#333' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                No products found
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product._id || product.id || index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '1rem' }}>
                  <img 
                    src={getImageUrl(product.image)} 
                    alt=""
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover', 
                      borderRadius: '4px', 
                      display: 'block',
                      background: '#f0f0f0'
                    }}
                    onError={(e) => { 
                      const placeholder = 'https://via.placeholder.com/50';
                      if (e.target.src !== placeholder) {
                        e.target.src = placeholder;
                      }
                    }}
                  />
                </td>
                <td style={{ padding: '1rem', color: '#333' }}>{product.title || product.name}</td>
                <td style={{ padding: '1rem', color: '#666', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.description}
                </td>
                <td style={{ padding: '1rem', color: '#666' }}>{product.category}</td>
                <td style={{ padding: '1rem', color: '#333', fontWeight: '500' }}>${product.price}</td>
                <td style={{ padding: '1rem', color: product.stock > 0 ? '#4caf50' : '#f44336' }}>
                  {product.stock}
                </td>
                <td style={{ padding: '1rem', color: '#666', fontSize: '0.875rem' }}>
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', color: '#666', fontSize: '0.875rem' }}>
                  {new Date(product.updatedAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <IconButton
                      icon={<EditIcon />}
                      variant="primary"
                      title={onEdit ? "Edit product" : "Edit disabled"}
                      onClick={() => onEdit && onEdit(product)}
                      disabled={!onEdit}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      variant="danger"
                      title={onDelete ? "Delete product" : "Delete disabled"}
                      onClick={() => onDelete && onDelete(product)}
                      disabled={!onDelete}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductGrid;

