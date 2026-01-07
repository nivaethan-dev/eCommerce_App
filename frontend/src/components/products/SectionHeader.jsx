import React from 'react';
import './SectionHeader.css';

/**
 * SectionHeader - Category title with "View All" action
 * @param {string} title - Category title
 * @param {Function} onViewAll - Handler for "View All" action
 */
const SectionHeader = ({ title, onViewAll }) => {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {onViewAll && (
        <button 
          className="view-all-link" 
          onClick={onViewAll}
          aria-label={`View all ${title} products`}
        >
          View All →
        </button>
      )}
    </div>
  );
};

export default SectionHeader;

