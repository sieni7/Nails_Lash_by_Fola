import React from 'react';

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCall = () => {
    window.location.href = 'tel:+2250161210647';
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('+225 01 61 21 06 47').then(() => {
        alert('Numéro copié !');
      });
    } else {
      alert('Numéro copié !');
    }
  };

  return (
    <div className="custom-modal active" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Bannière de couverture */}
        <div className="profile-cover">
          <img src="/images/flyer.png" alt="Cover" className="profile-cover-img" onError={(e) => e.target.style.display='none'} />
        </div>
        
        {/* Avatar carré */}
        <div className="profile-avatar-container">
          <img src="/images/logo.png" alt="Nails & Lash by Fola" className="profile-avatar" onError={(e) => e.target.style.display='none'} />
        </div>
        
        {/* Infos principales */}
        <div className="profile-info">
          <h2 className="profile-name">Nails & Lash by Fola</h2>
          <p className="profile-slogan">✨ Révélez votre beauté, affirmez votre style</p>
          
          <div className="profile-badges">
            <span className="profile-badge">💅 Salon de beauté</span>
            <span className="profile-badge">📍 Bingerville</span>
          </div>
        </div>
        
        {/* Détails avec icônes */}
        <div className="profile-details">
          <div className="profile-detail">
            <span className="detail-icon">📍</span>
            <div>
              <div className="detail-label">Adresse</div>
              <div className="detail-value">947G+5FX, Bingerville, Côte d'Ivoire</div>
            </div>
          </div>
          
          <div className="profile-detail">
            <span className="detail-icon">📞</span>
            <div>
              <div className="detail-label">Téléphone / WhatsApp</div>
              <div className="detail-value">+225 01 61 21 06 47</div>
            </div>
          </div>
          
          <div className="profile-detail">
            <span className="detail-icon">⏰</span>
            <div>
              <div className="detail-label">Horaires</div>
              <div className="detail-value">Mardi - Dimanche : 9h00 - 21h00</div>
              <div className="detail-value closed">Lundi : Fermé</div>
            </div>
          </div>
          
          <div className="profile-detail">
            <span className="detail-icon">📱</span>
            <div>
              <div className="detail-label">Réseaux sociaux</div>
              <div className="detail-value social-links">
                <a href="https://tiktok.com/@folakemi8786" target="_blank" rel="noopener noreferrer">TikTok</a> • 
                <a href="https://facebook.com/NailsLashByFola" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="profile-actions">
          <button className="profile-btn profile-btn-call" onClick={handleCall}>
            📞 Appeler
          </button>
          <button className="profile-btn profile-btn-copy" onClick={handleCopy}>
            📋 Copier
          </button>
        </div>
        
        {/* Note de fermeture */}
        <div className="profile-footer">
          <button className="profile-close" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
