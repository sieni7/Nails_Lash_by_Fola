// Accessibility enhancements
(function enhanceAccessibility() {
  // Ajouter ARIA labels
  document.querySelectorAll('.prestation-card').forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Sélectionner cette prestation');
  });
  
  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('cart-modal');
      if (modal?.classList.contains('active')) {
        closeCartModal();
      }
    }
  });
  
  // Focus visible
  const style = document.createElement('style');
  style.textContent = `
    :focus-visible {
      outline: 3px solid #25D366;
      outline-offset: 2px;
    }
    button:focus-visible, [role="button"]:focus-visible {
      outline: 2px solid #075E54;
    }
  `;
  document.head.appendChild(style);
  
  console.log('✅ Accessibility enhancements loaded');
})();
