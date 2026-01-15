import React from 'react';
import './CategoryFilterBar.css';

const CategoryFilterBar = ({
  categories = [],
  value = '',
  onChange,
  disabled = false,
  label = 'Category',
}) => {
  return (
    <div className="category-filterbar">
      <label className="category-filterbar-label">
        {label}
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="category-filterbar-select"
          disabled={disabled}
          aria-label="Select category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CategoryFilterBar;


