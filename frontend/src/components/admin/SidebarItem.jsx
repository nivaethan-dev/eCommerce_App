import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, label, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
    >
      <span className="sidebar-icon">{icon}</span>
      <span className="sidebar-label">{label}</span>
    </NavLink>
  );
};

export default SidebarItem;

