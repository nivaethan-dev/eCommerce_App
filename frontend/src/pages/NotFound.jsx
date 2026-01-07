import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

/**
 * 404 Not Found Page
 * Shown for invalid routes or unauthorized access to protected routes
 */
const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-description">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="home-link">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

