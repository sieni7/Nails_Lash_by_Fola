import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const [config, setConfig] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    fetch('/data/config.json')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        checkOpenStatus(data.horaires);
      });
  }, []);

  const checkOpenStatus = (horaires) => {
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const aujourdhui = jours[new Date().getDay()];
    const horaireAujourdhui = horaires[aujourdhui];
    
    if (horaireAujourdhui === 'Fermé') {
      setIsOpen(false);
      return;
    }
    
    const now = new Date();
    const [openHour, closeHour] = horaireAujourdhui.split(' - ');
    const currentHour = now.getHours();
    
    setIsOpen(currentHour >= parseInt(openHour) && currentHour < parseInt(closeHour));
  };

  return (
    <>
      <header className="wa-header">
        <div className="wa-header__avatar" onClick={() => setShowModal(true)}>
          <img src="/images/logo.png" alt="Nails & Lash by Fola" onError={(e) => e.target.src='https://placehold.co/48x48/075E54/white?text=F'} />
        </div>
        <div className="wa-header__info">
          <h1>{config?.salon.nom || "Nails & Lash by Fola"}</h1>
          <div className="status">
            {isOpen ? "🟢 En ligne · Ouvert jusqu'à 21h" : "⭕ Fermé · Mar-Dim 9h-21h"}
          </div>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="dark-mode-toggle"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {showModal && (
        <div className="custom-modal active">
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <div className="custom-modal-icon" style={{ marginBottom: '15px' }}>
                <img src="/images/logo.png" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
              </div>
              <div className="custom-modal-title">{config?.salon.nom}</div>
              <div className="custom-modal-message" style={{ whiteSpace: 'pre-line', marginTop: '15px' }}>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(config?.salon.adresse + " " + (config?.salon.maps_code || ''))}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-teal)', textDecoration: 'none', fontWeight: 'bold' }}>
                  📍 {config?.salon.adresse}
                </a>
                {`\n📞 ${config?.salon.whatsapp}\n⏰ Mardi-Dimanche 9h-21h\n\n✨ Révélez votre beauté, affirmez votre style`}
              </div>
            </div>
            <div className="custom-modal-actions">
              <button className="custom-modal-btn custom-modal-btn-primary" onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
