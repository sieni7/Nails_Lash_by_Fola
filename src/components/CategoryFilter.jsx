import React, { useState } from 'react';

const CategoryFilter = ({ prestations, currentCategory, onSelectCategory }) => {
  const categories = ['Toutes', ...new Set(prestations.map(p => p.categorie))];

  return (
    <div className="categories-grid">
      {categories.map(cat => (
        <button
          key={cat}
          className={`category-chip ${currentCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
