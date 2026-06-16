import React from 'react';
import { useToast } from './Toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleCall = () => {
    window.location.href = 'tel:+2250161210647';
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('+225 01 61 21 06 47').then(() => {
        showToast('Num\xE9ro copi\xE9 !', 'success');
      });
    } else {
      showToast('Num\xE9ro copi\xE9 !', 'success');
    }
  };

  return (
    <div className="custom-modal active" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Banniere de couverture */}
        <div className="profile-cover">
          <img src="/images/flyer.png" alt="Cover" className="profile-cover-img" onError={(e) => e.target.style.display='none'} />
        </div>
        
        {/* Avatar carre */}
        <div className="profile-avatar-container">
          <img src="/images/logo.png" alt="Nails & Lash by Fola" className="profile-avatar" onError={(e) => e.target.style.display='none'} />
        </div>
        
        {/* Infos principales */}
        <div className="profile-info">
          <h2 className="profile-name">Nails & Lash by Fola</h2>
          <p className="profile-slogan">{'\u2728'} R\xE9v\xE9lez votre beaut\xE9, affirmez votre style</p>
          
          <div className="profile-badges">
            <span className="profile-badge">{'\uD83D\uDC85'} Salon de beaut\xE9</span>
            <span className="profile-badge">{'\uD83D\uDCCD'} Bingerville</span>
          </div>
        </div>
        
        {/* Details avec icones */}
        <div className="profile-details">
          <div className="profile-detail">
            <span className="detail-icon">{'\uD83D\uDCCD'}</span>
            <div>
              <div className="detail-label">Adresse</div>
              <div className="detail-value">947G+5FX, Bingerville, C\xF4te d'Ivoire</div>
            </div>
          </div>
          
          <div className="profile-detail">
            <span className="detail-icon">{'\uD83D\uDCDE'}</span>
            <div>
              <div className="detail-label">T\xE9l\xE9phone / WhatsApp</div>
              <div className="detail-value">+225 01 61 21 06 47</div>
            </div>
          </div>
          
          <div className="profile-detail">
            <span className="detail-icon">{'\u23F0'}</span>
            <div>
              <div className="detail-label">Horaires</div>
              <div className="detail-value">Mardi - Dimanche : 9h00 - 21h00</div>
              <div className="detail-value closed">Lundi : Ferm\xE9</div>
            </div>
          </div>
          
          <div className="profile-detail">
            <span className="detail-icon">{'\uD83D\uDCF1'}</span>
            <div>
              <div className="detail-label">R\xE9seaux sociaux</div>
              <div className="detail-value social-links">
                <a href="https://tiktok.com/@folakemi8786" target="_blank" rel="noopener noreferrer">TikTok</a> {'\u2022'} 
                <a href="https://facebook.com/NailsLashByFola" target="_blank" rel="noopener noreferrer">Facebook</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="profile-actions">
          <button className="profile-btn profile-btn-call" onClick={handleCall}>
            {'\uD83D\uDCDE'} Appeler
          </button>
          <button className="profile-btn profile-btn-copy" onClick={handleCopy}>
            {'\uD83D\uDCCB'} Copier
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
