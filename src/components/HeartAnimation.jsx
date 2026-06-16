import React, { useEffect, useState } from 'react';

const HeartAnimation = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Position aléatoire autour du clic
    setPosition({
      x: Math.random() * 60 - 30,
      y: Math.random() * 40 - 60
    });
  }, []);
  
  return (
    <div 
      className="heart-animation"
      style={{
        position: 'absolute',
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
        transform: 'translate(-50%, -50%)',
        fontSize: '32px',
        animation: 'heartFloat 0.8s ease-out forwards',
        pointerEvents: 'none',
        zIndex: 100,
        filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))'
      }}
    >
      ❤️
    </div>
  );
};

// Ajouter les animations dans un <style> global ou dans le CSS
const injectStyles = () => {
  if (document.getElementById('heart-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'heart-styles';
  style.textContent = `
    @keyframes heartFloat {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 0.9;
        transform: translate(-50%, -50%) scale(1.3);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -80px) scale(0.5);
      }
    }
  `;
  document.head.appendChild(style);
};

if (typeof document !== 'undefined') {
  injectStyles();
}

export default HeartAnimation;
