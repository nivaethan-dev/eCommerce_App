const ProductGrid = ({ products = [] }) => {
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
              <tr key={product.id || index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '1rem' }}>
                  <img 
                    src={product.image || 'https://via.placeholder.com/50'} 
                    alt={product.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ padding: '1rem', color: '#333' }}>{product.name}</td>
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
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '1.25rem',
                        padding: '0.25rem',
                        color: '#4facfe'
                      }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        fontSize: '1.25rem',
                        padding: '0.25rem',
                        color: '#f44336'
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
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

