import { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Users,
  FileText,
  Plus,
  Trash2,
  Search,
  Bell,
  User,
  Menu,
  Edit,
  X
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // State for Navigation
  const [activeView, setActiveView] = useState('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Mock Data & State
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45 },
    { id: 2, name: 'Yoga Mat', category: 'Sports', price: 29.99, stock: 120 },
    { id: 3, name: 'Face Serum', category: 'Beauty', price: 45.00, stock: 30 },
  ]);

  const [orders, setOrders] = useState([
    { id: 101, customer: 'John Doe', date: '2023-10-25', total: 129.98, status: 'Delivered' },
    { id: 102, customer: 'Jane Smith', date: '2023-10-26', total: 29.99, status: 'Processing' },
    { id: 103, customer: 'Robert Johnson', date: '2023-10-27', total: 199.50, status: 'Pending' },
  ]);

  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2023-03-22' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', joinDate: '2023-05-10' },
  ]);

  const logs = [
    { id: 1, timestamp: '2023-10-27 10:30', user: 'Admin', role: 'Super Admin', action: 'Update', entity: 'Product', field: 'Price', oldVal: '89.99', newVal: '99.99' },
    { id: 2, timestamp: '2023-10-26 14:15', user: 'Manager', role: 'Editor', action: 'Delete', entity: 'Order', field: '-', oldVal: '#100', newVal: '-' },
    { id: 3, timestamp: '2023-10-26 09:20', user: 'Admin', role: 'Super Admin', action: 'Create', entity: 'User', field: '-', oldVal: '-', newVal: 'Jane Smith' },
  ];

  // Hide global footer on mount
  useEffect(() => {
    const footer = document.querySelector('.footer');
    if (footer) footer.style.display = 'none';

    return () => {
      if (footer) footer.style.display = 'block';
    };
  }, []);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: ''
  });

  // Handlers
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: p.id, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) } : p));
      setEditingProduct(null);
    } else {
      const product = {
        id: products.length + 1,
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      };
      setProducts([...products, product]);
    }

    setIsProductModalOpen(false);
    setNewProduct({ name: '', category: 'Electronics', price: '', stock: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Render Helpers
  const getStatusBadge = (status) => {
    const formatted = status.toLowerCase();
    return <span className={`badge badge-${formatted}`}>{status}</span>;
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar Navigation */}
      {/* Sidebar Navigation */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <span style={{ fontSize: '1.5rem' }}>⚡</span> AdminPanel
          </div>
          <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveView('products'); setIsSidebarOpen(false); }}
          >
            <Package className="nav-icon" /> Products
          </button>
          <button
            className={`nav-item ${activeView === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveView('orders'); setIsSidebarOpen(false); }}
          >
            <ShoppingCart className="nav-icon" /> Orders
          </button>
          <button
            className={`nav-item ${activeView === 'customers' ? 'active' : ''}`}
            onClick={() => { setActiveView('customers'); setIsSidebarOpen(false); }}
          >
            <Users className="nav-icon" /> Customers
          </button>
          <button
            className={`nav-item ${activeView === 'logs' ? 'active' : ''}`}
            onClick={() => { setActiveView('logs'); setIsSidebarOpen(false); }}
          >
            <FileText className="nav-icon" /> Audit Logs
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="search-bar">
              <Search size={18} color="#6b7280" />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
          </div>
          <div className="user-profile">
            <Bell size={20} color="#6b7280" style={{ cursor: 'pointer', marginRight: '1rem' }} />
            <div className="avatar">AD</div>
            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Admin User</span>
          </div>
        </header>

        <div className="content-area">
          {/* Products View */}
          {activeView === 'products' && (
            <div className="view-container">
              <div className="page-header">
                <h2 className="page-title">Products</h2>
                <button className="btn btn-primary" onClick={() => setIsProductModalOpen(true)}>
                  <Plus size={18} /> Add Product
                </button>
              </div>
              <div className="card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td style={{ fontWeight: 500 }}>{product.name}</td>
                        <td>{product.category}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-primary btn-icon" // Reusing primary for edit
                              style={{ padding: '0.4rem' }}
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-danger btn-icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeView === 'orders' && (
            <div className="view-container">
              <div className="page-header">
                <h2 className="page-title">Orders</h2>
              </div>
              <div className="card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers View */}
          {activeView === 'customers' && (
            <div className="view-container">
              <div className="page-header">
                <h2 className="page-title">Customers</h2>
              </div>
              <div className="card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
                      <tr key={customer.id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                            {customer.name.charAt(0)}
                          </div>
                          {customer.name}
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.joinDate}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-icon"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Logs View */}
          {activeView === 'logs' && (
            <div className="view-container">
              <div className="page-header">
                <h2 className="page-title">Audit Logs</h2>
              </div>
              <div className="card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User</th>
                      <th>Role</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Field</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td>{log.timestamp}</td>
                        <td>{log.user}</td>
                        <td><span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{log.role}</span></td>
                        <td style={{ fontWeight: 500 }}>{log.action}</td>
                        <td>{log.entity}</td>
                        <td>{log.field}</td>
                        <td style={{ color: '#ef4444' }}>{log.oldVal}</td>
                        <td style={{ color: '#166534' }}>{log.newVal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={() => setIsProductModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Garden</option>
                  <option>Sports</option>
                  <option>Books</option>
                  <option>Toys</option>
                  <option>Beauty</option>
                  <option>Health</option>
                </select>
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  style={{ background: '#f3f4f6' }}
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


