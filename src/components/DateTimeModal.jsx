import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

const DateTimeModal = ({ onClose, onConfirm }) => {
  const { showModal } = useCart();
  const [config, setConfig] = useState(null);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    fetch('/data/config.json')
      .then(res => res.json())
      .then(data => setConfig(data));
      
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleConfirm = () => {
    if (!date || !selectedSlot) {
      showModal("Erreur", "Veuillez sélectionner une date et un créneau.", "⚠️");
      return;
    }
    onConfirm({ date, slot: selectedSlot });
  };

  const getAvailableSlots = () => {
    if (!config) return [];
    // Simplification: returns all slots from config.
    // In a real app, this would check against taken slots in localStorage or backend.
    return config.creneaux.liste;
  };

  return (
    <div className="custom-modal active">
      <div className="custom-modal-content" style={{ maxWidth: '400px' }}>
        <div className="custom-modal-header">
          <div className="custom-modal-icon">📅</div>
          <div className="custom-modal-title">Choisissez votre créneau</div>
        </div>
        
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Date :</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedSlot(''); // Reset slot when date changes
              }}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Créneaux disponibles :</label>
            <div className="slot-selector">
              {getAvailableSlots().map(slot => (
                <div 
                  key={slot}
                  className={`slot-option ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="custom-modal-actions">
          <button className="custom-modal-btn custom-modal-btn-secondary" onClick={onClose}>Retour</button>
          <button 
            className="custom-modal-btn custom-modal-btn-primary" 
            onClick={handleConfirm}
            disabled={!date || !selectedSlot}
            style={{ opacity: (!date || !selectedSlot) ? 0.5 : 1 }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeModal;
