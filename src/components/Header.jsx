import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ProfileModal from './ProfileModal';

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
        <div className="wa-header__avatar" onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
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

      <ProfileModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Header;
