import React from 'react';
import PrestationCard from './PrestationCard';

const PrestationGrid = ({ prestations, loading }) => {
  if (loading) {
    return (
      <div className="prestations-grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="skeleton-card skeleton-anim">
            <div className="skeleton-header">
              <div className="skeleton-badge"></div>
              <div className="skeleton-icon"></div>
            </div>
            <div className="skeleton-title"></div>
            <div className="skeleton-desc"></div>
            <div className="skeleton-footer">
              <div className="skeleton-price"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="prestations-grid" id="prestations-container">
      {prestations.map(p => (
        <PrestationCard key={p.id} prestation={p} />
      ))}
    </div>
  );
};

export default PrestationGrid;
