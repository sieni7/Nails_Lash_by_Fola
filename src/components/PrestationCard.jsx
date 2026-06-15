import React from 'react';
import { useCart } from '../contexts/CartContext';

const PrestationCard = ({ prestation }) => {
  const { panier, ajouterAuPanier, retirerDuPanier } = useCart();
  const isSelected = panier.some(p => p.id === prestation.id);
  
  return (
    <div 
      className={`prestation-card ${isSelected ? 'selected' : ''}`}
      onClick={() => isSelected ? retirerDuPanier(prestation.id) : ajouterAuPanier(prestation)}
    >
      <div className="card-content">
        <div className="card-header">
          <span className="card-categorie">{prestation.categorie}</span>
          <span className="card-icon">{prestation.icon || '💅'}</span>
        </div>
        <h3 className="card-title">{prestation.nom}</h3>
        <p className="card-description">{prestation.description}</p>
        <div className="card-footer">
          <span className="card-price">{prestation.prix_texte}</span>
          <span className="card-duree">⏱️ {prestation.duree} min</span>
        </div>
      </div>
      {isSelected && <div className="selection-badge">✓</div>}
    </div>
  );
};

export default PrestationCard;
