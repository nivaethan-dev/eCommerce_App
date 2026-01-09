import SidebarItem from './SidebarItem';
import './AdminSidebar.css';

const navItems = [
  { path: '/admin/products', label: 'Products', icon: '📦' },
  { path: '/admin/orders', label: 'Orders', icon: '🛒' },
  { path: '/admin/customers', label: 'Customers', icon: '👥' },
  { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' }
];

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <SidebarItem key={item.path} to={item.path} label={item.label} icon={item.icon} />
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;

