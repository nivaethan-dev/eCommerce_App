import React from 'react';
import SectionHeader from './SectionHeader';
import ProductGrid from './ProductGrid';
import './CategorySection.css';

/**
 * CategorySection - Wraps header + products for a single category
 * @param {string} category - Category name
 * @param {Array} products - Array of products in this category
 * @param {Function} onViewAll - Handler for "View All" action
 */
const CategorySection = ({ category, products, onViewAll }) => {
  const previewProducts = (products || []).slice(0, 6);

  return (
    <section className="category-section">
      <SectionHeader 
        title={category} 
        onViewAll={onViewAll}
      />
      <ProductGrid products={previewProducts} />
    </section>
  );
};

export default CategorySection;
