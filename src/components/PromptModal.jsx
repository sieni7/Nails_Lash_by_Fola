import React, { useState } from 'react';

const PromptModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = (e) => {
    e.preventDefault();
    onConfirm(inputValue);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="custom-modal active" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="custom-modal-content" style={{ maxWidth: '320px' }} onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <div className="custom-modal-icon">🔐</div>
          <div className="custom-modal-title">{title}</div>
          <div className="custom-modal-message">{message}</div>
        </div>
        <form onSubmit={handleConfirm} style={{ padding: '0 16px' }}>
          <input
            type="password"
            className="prompt-input"
            placeholder="Code PIN"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--gray-300)',
              fontSize: '16px',
              marginBottom: '16px',
              textAlign: 'center'
            }}
          />
          <div className="custom-modal-actions" style={{ padding: '0 0 16px 0' }}>
            <button type="button" className="custom-modal-btn custom-modal-btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="custom-modal-btn custom-modal-btn-primary">
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;
