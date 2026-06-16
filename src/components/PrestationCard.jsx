import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import useLongPress from '../hooks/useLongPress';

const PrestationCard = ({ prestation }) => {
  const { panier, ajouterAuPanier, retirerDuPanier, showToast } = useCart();
  const isSelected = panier.some(p => p.id === prestation.id);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(prestation.id);
  });

  // Appui long = ajouter/retirer des favoris ❤️
  const handleLongPress = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Retirer des favoris
      const newFavorites = favorites.filter(id => id !== prestation.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      showToast(`💔 ${prestation.nom} retiré des favoris`, 'error');
    } else {
      // Ajouter aux favoris
      favorites.push(prestation.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      showToast(`❤️ ${prestation.nom} ajouté aux favoris !`, 'info');
    }
  };

  // Clic simple = sélection/désélection du panier
  const handleClick = () => {
    isSelected ? retirerDuPanier(prestation.id) : ajouterAuPanier(prestation);
  };

  const longPressProps = useLongPress(handleLongPress, handleClick, { delay: 500 });

  return (
    <div 
      className={`prestation-card ${isSelected ? 'selected' : ''}`}
      {...longPressProps}
    >
      <div className="card-content">
        <div className="card-header">
          <span className="card-categorie">{prestation.categorie}</span>
          <span className="card-icon">{prestation.icon || '💅'}</span>
          {/* Indicateur favori */}
          {isFavorite && <span className="favorite-star">⭐</span>}
        </div>
        
        <h3 className="card-title">{prestation.nom}</h3>
        <p className="card-description">{prestation.description}</p>
        
        <div className="card-footer">
          <div className="prix-whatsapp-badge">
            <span className="prix-icon">💰</span>
            <span className="prix-valeur">{prestation.prix_texte}</span>
          </div>
          <span className="card-duree">⏱️ {prestation.duree} min</span>
        </div>
      </div>
      
      {isSelected && <div className="selection-badge">✓</div>}
      {isFavorite && <div className="favorite-badge">❤️</div>}
    </div>
  );
};

export default PrestationCard;
