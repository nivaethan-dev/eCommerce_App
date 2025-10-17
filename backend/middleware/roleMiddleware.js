export const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Check if user has required role
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: `Access denied: ${requiredRole} role required`
      });
    }

    // Role check passed
    next();
  };
};
