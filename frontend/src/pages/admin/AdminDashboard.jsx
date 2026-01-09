const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin panel. Use the sidebar to navigate.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#4facfe' }}>📦 Products</h3>
          <p style={{ margin: 0, color: '#666' }}>Manage inventory</p>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#4facfe' }}>🛒 Orders</h3>
          <p style={{ margin: 0, color: '#666' }}>Track orders</p>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#4facfe' }}>👥 Customers</h3>
          <p style={{ margin: 0, color: '#666' }}>Manage customers</p>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#4facfe' }}>📋 Audit Logs</h3>
          <p style={{ margin: 0, color: '#666' }}>View system logs</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
