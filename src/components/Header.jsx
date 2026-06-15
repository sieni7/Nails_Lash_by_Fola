import React, { useState, useEffect } from 'react';

const Header = () => {
  const [config, setConfig] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      </header>

      {showModal && (
        <div className="custom-modal active">
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <div className="custom-modal-icon">ℹ️</div>
              <div className="custom-modal-title">{config?.salon.nom}</div>
              <div className="custom-modal-message" style={{ whiteSpace: 'pre-line' }}>
                {`📍 ${config?.salon.adresse}\n📞 ${config?.salon.whatsapp}\n⏰ Mardi-Dimanche 9h-21h\n\n✨ Révélez votre beauté, affirmez votre style`}
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
