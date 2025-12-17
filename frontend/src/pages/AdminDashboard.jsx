import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">
          Welcome to the administrative control panel
        </p>
        
        <div className="admin-dashboard-content">
          {/* Placeholder content - can be expanded with admin features later */}
          <div className="dashboard-card">
            <h2>Dashboard Overview</h2>
            <p>This is the admin dashboard area. Add your administrative features here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

