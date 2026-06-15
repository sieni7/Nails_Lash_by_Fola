// ===== UI.JS - VERSION CORRIGÉE =====
let currentFilter = 'Toutes';

function renderPrestations(prestations, filter = 'Toutes') {
  const container = document.getElementById('prestations-container');
  if (!container) {
    console.error('❌ Container prestations non trouvé');
    return;
  }
  
  let filtered = prestations;
  if (filter !== 'Toutes') {
    filtered = prestations.filter(p => p.categorie === filter);
  }
  
  const panier = getPanier();
  const panierIds = new Set(panier.map(item => item.id));
  
  if (filtered.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;">Aucune prestation dans cette catégorie</div>';
    return;
  }
  
  container.innerHTML = filtered.map(presta => `
    <div class="prestation-card ${panierIds.has(presta.id) ? 'selected' : ''}" 
         data-id="${presta.id}">
      <div class="card-content">
        <div class="card-header">
          <span class="card-categorie">${escapeHtml(presta.categorie)}</span>
          <span class="card-icon">${presta.icon || '💅'}</span>
        </div>
        <h3 class="card-title">${escapeHtml(presta.nom)}</h3>
        <p class="card-description">${escapeHtml(presta.description)}</p>
        <div class="card-footer">
          <span class="card-price">${presta.prix_texte}</span>
          <span class="card-duree">⏱️ ${presta.duree} min</span>
        </div>
      </div>
      ${panierIds.has(presta.id) ? '<div class="selection-badge">✓</div>' : ''}
    </div>
  `).join('');
  
  // Attacher les events après rendu
  document.querySelectorAll('.prestation-card').forEach(card => {
    const id = card.dataset.id;
    card.removeEventListener('click', card._clickHandler);
    const handler = () => handlePrestationClick(id);
    card.addEventListener('click', handler);
    card._clickHandler = handler;
  });
}

function handlePrestationClick(id) {
  console.log('🖱️ Clic prestation:', id);
  
  const prestation = window.prestationsList?.find(p => p.id === id);
  if (!prestation) {
    console.error('Prestation non trouvée:', id);
    return;
  }
  
  let panier = getPanier();
  const isInCart = panier.some(item => item.id === id);
  
  if (isInCart) {
    // Désélectionner
    retirerDuPanier(id);
    showCustomModal("🗑️", "Prestation retirée", `${prestation.nom} a été retiré de votre panier.`, "info");
    console.log('🗑️ Retiré:', prestation.nom);
  } else {
    // Vérifier limite
    if (panier.length >= 3) {
      showCustomModal(
        "⚠️", 
        "Limite atteinte", 
        `Vous ne pouvez pas sélectionner plus de 3 prestations par commande.`
      );
      console.log('⚠️ Limite atteinte');
      return;
    }
    
    ajouterAuPanier(prestation);
    showCustomModal("✅", "Ajouté au panier", `${prestation.nom} a été ajouté à votre commande.`, "success");
    console.log('✅ Ajouté:', prestation.nom);
  }
  
  // Re-rendre
  if (window.prestationsList) {
    renderPrestations(window.prestationsList, currentFilter);
  }
  updateCartCount();
}

function renderCategories(prestations) {
  const categories = ['Toutes', ...new Set(prestations.map(p => p.categorie))];
  const container = document.getElementById('categories-filter');
  if (!container) return;
  
  container.innerHTML = categories.map(cat => `
    <div class="category-chip ${currentFilter === cat ? 'active' : ''}" 
         data-categorie="${cat}">
      ${cat}
    </div>
  `).join('');
  
  // Attacher events
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.removeEventListener('click', chip._clickHandler);
    const cat = chip.dataset.categorie;
    const handler = () => filterByCategory(cat);
    chip.addEventListener('click', handler);
    chip._clickHandler = handler;
  });
}

function filterByCategory(categorie) {
  console.log('🏷️ Filtre:', categorie);
  currentFilter = categorie;
  if (window.prestationsList) {
    renderCategories(window.prestationsList);
    renderPrestations(window.prestationsList, currentFilter);
  }
}

function updateCartCount() {
  const panier = getPanier();
  const count = panier.length;
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

function renderCartModal() {
  const panier = getPanier();
  const modalContent = document.getElementById('cart-modal-content');
  if (!modalContent) return;
  
  if (panier.length === 0) {
    modalContent.innerHTML = `
      <div class="cart-empty" style="text-align: center; padding: 40px;">
        🛒 Votre panier est vide
      </div>
      <div class="cart-actions">
        <button class="btn btn-primary" onclick="closeCartModal()">Continuer</button>
      </div>
    `;
    return;
  }
  
  const total = panier.reduce((sum, item) => {
    const prix = typeof item.prix === 'number' ? item.prix : 0;
    return sum + prix;
  }, 0);
  
  modalContent.innerHTML = `
    <div class="cart-items">
      ${panier.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${escapeHtml(item.nom)}</div>
            <div class="cart-item-price">${item.prix_texte}</div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑️</button>
        </div>
      `).join('')}
    </div>
    <div class="cart-total">
      <span>Total</span>
      <span>${total.toLocaleString()} FCFA</span>
    </div>
    <div class="cart-actions">
      <button class="btn btn-secondary" onclick="closeCartModal()">Continuer</button>
      <button class="btn btn-secondary" onclick="openDateTimeModal()">📅 Choisir un créneau</button>
      <button class="btn btn-primary" onclick="validateAndOrder()">✅ Commander via WhatsApp</button>
    </div>
  `;
}

// MODALE PERSONNALISÉE STYLISÉE
function showCustomModal(icon, title, message, type = "warning") {
  // Supprimer ancienne modale
  const existingModal = document.querySelector('.custom-modal');
  if (existingModal) existingModal.remove();
  
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.innerHTML = `
    <div class="custom-modal-content">
      <div class="custom-modal-header">
        <div class="custom-modal-icon">${icon}</div>
        <div class="custom-modal-title">${escapeHtml(title)}</div>
        <div class="custom-modal-message">${escapeHtml(message)}</div>
      </div>
      <div class="custom-modal-actions">
        <button class="custom-modal-btn custom-modal-btn-primary" onclick="this.closest('.custom-modal').remove()">OK</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);
  
  // Auto-fermeture pour les succès
  if (type === "success") {
    setTimeout(() => {
      if (modal && modal.parentNode) modal.remove();
    }, 2000);
  }
}

function removeFromCart(id) {
  retirerDuPanier(id);
  if (window.prestationsList) {
    renderPrestations(window.prestationsList, currentFilter);
  }
  renderCartModal();
  showCustomModal("🗑️", "Retiré", "Prestation retirée du panier", "info");
}

function closeCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.classList.remove('active');
}

function openCartModal() {
  const modal = document.getElementById('cart-modal');
  renderCartModal();
  modal.classList.add('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Exposer globalement
window.showCustomModal = showCustomModal;
window.filterByCategory = filterByCategory;
window.removeFromCart = removeFromCart;
window.closeCartModal = closeCartModal;
window.openCartModal = openCartModal;
window.handlePrestationClick = handlePrestationClick;
