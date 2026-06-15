import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import DateTimeModal from './DateTimeModal';

const CartModal = () => {
  const { panier, retirerDuPanier, viderPanier, compteurJour, incrementerCompteur } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  
  // Expose function to window or other components if needed, 
  // but better to use a global state or simple event for opening.
  // We can listen to a custom event for opening the cart
  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpen);
    return () => window.removeEventListener('openCart', handleOpen);
  }, []);

  const total = panier.reduce((sum, item) => sum + item.prix, 0);

  const handleContinuer = () => {
    if (panier.length === 0) return;
    if (compteurJour >= 10) {
      alert("⚠️ Limite de 10 commandes par jour atteinte.");
      return;
    }
    setIsOpen(false);
    setShowDateTime(true);
  };

  const handleOrderComplete = (details) => {
    // Generate WhatsApp Message
    const { date, slot } = details;
    const itemsText = panier.map(item => `▪️ ${item.nom} (${item.prix_texte})`).join('\n');
    
    const message = `*NOUVELLE COMMANDE* 💅\n\n` +
      `*Prestations choisies :*\n${itemsText}\n\n` +
      `*Total estimé :* ${total.toLocaleString('fr-FR')} FCFA\n` +
      `*Date :* ${date}\n` +
      `*Heure :* ${slot}\n\n` +
      `_Merci de confirmer ma réservation !_`;
      
    const whatsappUrl = `https://wa.me/2250161210647?text=${encodeURIComponent(message)}`;
    
    // Increment local counter
    incrementerCompteur();
    viderPanier();
    setShowDateTime(false);
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen && !showDateTime) return null;

  if (showDateTime) {
    return <DateTimeModal onClose={() => setShowDateTime(false)} onConfirm={handleOrderComplete} />;
  }

  return (
    <div className={`custom-modal ${isOpen ? 'active' : ''}`}>
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <div className="custom-modal-icon">🛒</div>
          <div className="custom-modal-title">Votre Panier</div>
          <div className="custom-modal-message">
            {panier.length === 0 ? "Votre panier est vide" : `${panier.length} prestation(s) sélectionnée(s)`}
          </div>
        </div>
        
        <div style={{ padding: '0 20px', maxHeight: '200px', overflowY: 'auto' }}>
          {panier.map((item, index) => (
            <div key={`${item.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.nom}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{item.prix_texte}</div>
              </div>
              <button 
                onClick={() => retirerDuPanier(item.id)}
                style={{ background: 'none', border: 'none', color: '#dc3545', fontSize: '18px', cursor: 'pointer' }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {panier.length > 0 && (
          <div style={{ padding: '15px 20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', background: '#f8f9fa' }}>
            <span>Total estimé:</span>
            <span>{total.toLocaleString('fr-FR')} FCFA</span>
          </div>
        )}

        <div className="custom-modal-actions">
          <button className="custom-modal-btn custom-modal-btn-secondary" onClick={() => setIsOpen(false)}>Fermer</button>
          {panier.length > 0 && (
            <button className="custom-modal-btn custom-modal-btn-primary" onClick={handleContinuer}>Continuer</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
