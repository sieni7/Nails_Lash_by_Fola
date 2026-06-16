import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import DateTimeModal from './DateTimeModal';

const CartModal = () => {
  const { panier, retirerDuPanier, viderPanier, compteurJour, incrementerCompteur, showModal } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [summaryDetails, setSummaryDetails] = useState(null);
  
  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpen);
    return () => window.removeEventListener('openCart', handleOpen);
  }, []);

  const total = panier.reduce((sum, item) => sum + item.prix, 0);

  const handleContinuer = () => {
    if (panier.length === 0) return;
    if (compteurJour >= 10) {
      showModal("Limite atteinte", "\u26A0\uFE0F Limite de 10 commandes par jour atteinte.", "\u26A0\uFE0F");
      return;
    }
    setIsOpen(false);
    setShowDateTime(true);
  };

  const handleOrderComplete = (details) => {
    setSummaryDetails(details);
    setShowDateTime(false);
  };

  const handleConfirmSummary = () => {
    const { date, slot } = summaryDetails;
    const itemsText = panier.map(item => `\uD83D\uDD39 ${item.nom} (${item.prix_texte})`).join('\n');
    
    const message = `*NOUVELLE COMMANDE* \uD83D\uDED2\n\n` +
      `*Prestations choisies :*\n${itemsText}\n\n` +
      `*Total estim\xE9 :* ${total.toLocaleString('fr-FR')} FCFA\n` +
      `*Date :* ${date}\n` +
      `*Heure :* ${slot}\n\n` +
      `_Merci de confirmer ma r\xE9servation !_`;
      
    const whatsappUrl = `https://wa.me/2250161210647?text=${encodeURIComponent(message)}`;
    
    incrementerCompteur();
    viderPanier();
    setSummaryDetails(null);
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen && !showDateTime && !summaryDetails) return null;

  if (showDateTime) {
    return <DateTimeModal onClose={() => { setShowDateTime(false); setIsOpen(true); }} onConfirm={handleOrderComplete} />;
  }

  if (summaryDetails) {
    const { date, slot } = summaryDetails;
    return (
      <div className="custom-modal active">
        <div className="custom-modal-content">
          <div className="custom-modal-header">
            <div className="custom-modal-icon">{'\uD83D\uDCCB'}</div>
            <div className="custom-modal-title">R&eacute;capitulatif</div>
            <div className="custom-modal-message">Veuillez v&eacute;rifier votre commande</div>
          </div>
          
          <div style={{ padding: '0 20px', textAlign: 'left', lineHeight: '1.5' }}>
            <p><strong>Date :</strong> {date}</p>
            <p><strong>Heure :</strong> {slot}</p>
            <p><strong>Prestations :</strong></p>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {panier.map((item, idx) => <li key={idx}>{item.nom}</li>)}
            </ul>
            <p style={{ marginTop: '10px', fontSize: '18px' }}><strong>Total : {total.toLocaleString('fr-FR')} FCFA</strong></p>
            
            <div style={{ marginTop: '15px', padding: '10px', background: 'var(--gray-100)', borderRadius: '8px', fontSize: '13px', color: 'var(--gray-900)' }}>
              <strong>{'\u2139\uFE0F'} Note importante :</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                <li>Paiement sur place (Esp&egrave;ces ou Mobile Money).</li>
                <li>Merci de respecter l'heure du rendez-vous.</li>
                <li>En cas d'emp&ecirc;chement, veuillez nous pr&eacute;venir &agrave; l'avance.</li>
              </ul>
            </div>
          </div>

          <div className="custom-modal-actions">
            <button className="custom-modal-btn custom-modal-btn-secondary" onClick={() => { setSummaryDetails(null); setShowDateTime(true); }}>Retour</button>
            <button className="custom-modal-btn custom-modal-btn-primary" onClick={handleConfirmSummary}>Envoyer (WhatsApp)</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`custom-modal ${isOpen ? 'active' : ''}`}>
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <div className="custom-modal-icon">{'\uD83D\uDED2'}</div>
          <div className="custom-modal-title">Votre Panier</div>
          <div className="custom-modal-message">
            {panier.length === 0 ? "Votre panier est vide" : `${panier.length} prestation(s) s\u00E9lectionn\u00E9e(s)`}
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
                title="Retirer"
              >
                {'\u274C'}
              </button>
            </div>
          ))}
        </div>

        {panier.length > 0 && (
          <div style={{ padding: '15px 20px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', background: '#f8f9fa' }}>
            <span>Total estim&eacute;:</span>
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
