import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Returns 404 for unauthenticated users to hide protected endpoints
 * Security measure: Does not reveal that protected routes exist
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Return 404 to hide that this route exists
    // This prevents information disclosure in pen testing
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;

