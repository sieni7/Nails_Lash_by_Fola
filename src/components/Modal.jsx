import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, icon, title, message, onConfirm, confirmText = 'OK', showCancel = false }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="custom-modal active" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <div className="custom-modal-icon">{icon || 'ℹ️'}</div>
          <div className="custom-modal-title">{title}</div>
          <div className="custom-modal-message" style={{ whiteSpace: 'pre-line' }}>{message}</div>
        </div>
        <div className="custom-modal-actions">
          {showCancel && (
            <button className="custom-modal-btn custom-modal-btn-secondary" onClick={onClose}>
              Annuler
            </button>
          )}
          <button className="custom-modal-btn custom-modal-btn-primary" onClick={onConfirm || onClose}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
