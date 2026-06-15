// Rendu UI dynamique
let currentFilter = 'Toutes';
let selectedPrestations = new Set();

function renderPrestations(prestations, filter = 'Toutes') {
  const container = document.getElementById('prestations-container');
  if (!container) return;
  
  let filtered = prestations;
  if (filter !== 'Toutes') {
    filtered = prestations.filter(p => p.categorie === filter);
  }
  
  const panier = getPanier();
  const panierIds = new Set(panier.map(item => item.id));
  
  container.innerHTML = filtered.map(presta => `
    <div class="prestation-card ${panierIds.has(presta.id) ? 'selected' : ''}" 
         data-id="${presta.id}"
         onclick="handlePrestationClick('${presta.id}')">
      <div class="card-content">
        <div class="card-header">
          <span class="card-categorie">${presta.categorie}</span>
          <span class="card-icon">${presta.icon || '💅'}</span>
        </div>
        <h3 class="card-title">${presta.nom}</h3>
        <p class="card-description">${presta.description}</p>
        <div class="card-footer">
          <span class="card-price">${presta.prix_texte}</span>
          <span class="card-duree">⏱️ ${presta.duree} min</span>
        </div>
      </div>
      ${panierIds.has(presta.id) ? '<div class="selection-badge">✓</div>' : ''}
    </div>
  `).join('');
  
  updateCartCount();
}

function renderCategories(prestations) {
  const categories = ['Toutes', ...new Set(prestations.map(p => p.categorie))];
  const container = document.getElementById('categories-filter');
  if (!container) return;
  
  container.innerHTML = categories.map(cat => `
    <div class="category-chip ${currentFilter === cat ? 'active' : ''}" 
         data-categorie="${cat}"
         onclick="filterByCategory('${cat}')">
      ${cat}
    </div>
  `).join('');
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
  if (!modalContent) {
      // Create modal content dynamically if not exist
      const modal = document.getElementById('cart-modal');
      if (modal) {
          modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Mon Panier</div>
                    <div class="close-modal" onclick="closeCartModal()">×</div>
                </div>
                <div id="cart-modal-content"></div>
            </div>
          `;
      }
  }
  const modalContentInner = document.getElementById('cart-modal-content');
  if (!modalContentInner) return;
  
  if (panier.length === 0) {
    modalContentInner.innerHTML = `
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
  
  modalContentInner.innerHTML = `
    <div class="cart-items">
      ${panier.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.nom}</div>
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
      <button class="btn btn-primary" onclick="validateAndOrder()">✅ Commander via WhatsApp</button>
    </div>
  `;
}

function filterByCategory(categorie) {
  currentFilter = categorie;
  if (window.prestationsList) {
    renderCategories(window.prestationsList);
    renderPrestations(window.prestationsList, currentFilter);
  }
}

function handlePrestationClick(id) {
  const prestation = window.prestationsList?.find(p => p.id === id);
  if (!prestation) return;
  
  const success = ajouterAuPanier(prestation);
  if (success) {
    renderPrestations(window.prestationsList, currentFilter);
    showToast('✅ Ajouté au panier', 'success');
  }
}

function removeFromCart(id) {
  retirerDuPanier(id);
  renderPrestations(window.prestationsList, currentFilter);
  renderCartModal();
  showToast('🗑️ Retiré du panier', 'info');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 150px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#25D366' : '#075E54'};
    color: white;
    padding: 12px 20px;
    border-radius: 28px;
    z-index: 1000;
    animation: fadeOut 2s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
