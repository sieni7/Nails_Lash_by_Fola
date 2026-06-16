import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import HeartAnimation from './HeartAnimation';

const PrestationCard = ({ prestation }) => {
  const { panier, ajouterAuPanier, retirerDuPanier, showToast } = useCart();
  const [showHeart, setShowHeart] = useState(false);
  const isSelected = panier.some(p => p.id === prestation.id);
  
  // Double clic = réaction cœur
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
    
    // Optionnel: ajouter un effet haptique
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Optionnel: ajouter la prestation aux favoris (localStorage)
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(prestation.id)) {
      favorites.push(prestation.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      if (showToast) showToast(`❤️ ${prestation.nom} ajouté aux favoris`, 'info');
    }
  };
  
  return (
    <div 
      className={`prestation-card ${isSelected ? 'selected' : ''}`}
      onClick={() => isSelected ? retirerDuPanier(prestation.id) : ajouterAuPanier(prestation)}
      onDoubleClick={handleDoubleClick}
      style={{ position: 'relative' }}
    >
      {showHeart && <HeartAnimation />}
      
      <div className="card-content">
        <div className="card-header">
          <span className="card-categorie">{prestation.categorie}</span>
          <span className="card-icon">{prestation.icon || '💅'}</span>
        </div>
        
        <h3 className="card-title">{prestation.nom}</h3>
        <p className="card-description">{prestation.description}</p>
        
        <div className="card-footer">
          {/* BADGE PRIX STYLE WHATSAPP */}
          <div className="prix-whatsapp-badge">
            <span className="prix-icon">💰</span>
            <span className="prix-valeur">{prestation.prix_texte}</span>
          </div>
          
          <span className="card-duree">⏱️ {prestation.duree} min</span>
        </div>
      </div>
      
      {isSelected && <div className="selection-badge">✓</div>}
    </div>
  );
};

export default PrestationCard;
