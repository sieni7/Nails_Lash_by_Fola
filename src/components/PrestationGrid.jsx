import React from 'react';
import PrestationCard from './PrestationCard';

// Skeleton amélioré - style WhatsApp
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-categorie"></div>
      <div className="skeleton-icon"></div>
    </div>
    <div className="skeleton-title"></div>
    <div className="skeleton-description"></div>
    <div className="skeleton-footer">
      <div className="skeleton-price"></div>
      <div className="skeleton-duree"></div>
    </div>
  </div>
);

const PrestationGrid = ({ prestations, loading }) => {
  if (loading) {
    return (
      <div className="prestations-grid">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  
  if (!prestations || prestations.length === 0) {
    return (
      <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-600)' }}>
        <span className="empty-icon" style={{ fontSize: '48px', display: 'block', marginBottom: '10px' }}>📦</span>
        <p>Aucune prestation disponible</p>
      </div>
    );
  }
  
  return (
    <div className="prestations-grid">
      {prestations.map(prestation => (
        <PrestationCard key={prestation.id} prestation={prestation} />
      ))}
    </div>
  );
};

export default PrestationGrid;
