import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Returns 404 for unauthenticated users to hide protected endpoints
 * Security measure: Does not reveal that protected routes exist
 */
const ProtectedRoute = ({ children, requiredRole, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    // Return 404 to hide that this route exists
    // This prevents information disclosure in pen testing
    return <Navigate to="/404" replace />;
  }

  // Optional role-gating (keeps backward compatibility for non-role-protected pages)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/404" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;

