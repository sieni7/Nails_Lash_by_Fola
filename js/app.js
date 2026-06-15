// Application principale
window.prestationsList = [];

async function initApp() {
  console.log('🚀 Démarrage de Nails & Lash by Fola');
  
  // Charger configuration
  await loadConfig();
  
  // Charger prestations
  window.prestationsList = await loadPrestations();
  
  if (window.prestationsList && window.prestationsList.length > 0) {
    // Inject Categories Filter Element before the grid if not exists
    let categoriesFilter = document.getElementById('categories-filter');
    if (!categoriesFilter) {
       const mainContent = document.querySelector('.main-content');
       categoriesFilter = document.createElement('div');
       categoriesFilter.id = 'categories-filter';
       categoriesFilter.className = 'categories-filter';
       mainContent.insertBefore(categoriesFilter, document.getElementById('prestations-container'));
    }

    renderCategories(window.prestationsList);
    renderPrestations(window.prestationsList);
  }
  
  // Afficher statut ouverture
  updateOpenStatus();
  
  console.log('✅ Application prête');
}

function updateOpenStatus() {
  const open = isOpenNow();
  const statusEl = document.querySelector('.wa-header__info .status');
  if (statusEl) {
    if (open) {
      statusEl.innerHTML = '🟢 En ligne · Ouvert jusqu\'à 21h';
    } else {
      statusEl.innerHTML = '⭕ Fermé · Mar-Dim 9h-21h';
    }
  }
}

function openCartModal() {
  const modal = document.getElementById('cart-modal');
  renderCartModal();
  modal.classList.add('active');
}

function closeCartModal() {
  const modal = document.getElementById('cart-modal');
  modal.classList.remove('active');
}

function validateAndOrder() {
  const panier = getPanier();
  
  if (panier.length === 0) {
    alert('Votre panier est vide');
    return;
  }
  
  if (!commandesDisponibles()) {
    alert(`⚠️ Désolé, nous avons atteint notre limite de ${appConfig?.regles_commande.limite_quotidienne_commandes} commandes pour aujourd'hui. Réessayez demain !`);
    return;
  }
  
  if (!isOpenNow()) {
    alert('Le salon est fermé. Horaires : Mardi-Dimanche 9h-21h');
    return;
  }
  
  // Générer message WhatsApp
  generateWhatsAppMessage(panier);
}

function generateWhatsAppMessage(panier) {
  const total = panier.reduce((sum, item) => {
    const prix = typeof item.prix === 'number' ? item.prix : 0;
    return sum + prix;
  }, 0);
  
  let message = `*🛍️ NOUVELLE COMMANDE - Nails & Lash by Fola*%0A%0A`;
  message += `*📋 Prestations sélectionnées :*%0A`;
  
  panier.forEach((item, index) => {
    message += `${index + 1}. ${item.nom} - ${item.prix_texte}%0A`;
  });
  
  message += `%0A*💰 Total : ${total.toLocaleString()} FCFA*%0A%0A`;
  message += `👤 Client : (à compléter)%0A`;
  message += `📅 Date souhaitée : (à préciser)%0A`;
  message += `⏰ Horaire : (9h-21h, mar-dim)%0A%0A`;
  message += `📍 Adresse : 947G+5FX, Bingerville%0A`;
  message += `_Merci de confirmer ma commande_ 🙏`;
  
  const numero = appConfig?.salon.whatsapp || '2250161210647';
  const url = `https://wa.me/${numero}?text=${message}`;
  
  // Incrémenter compteur
  incrementerCompteurJour();
  
  // Vider panier après commande
  viderPanier();
  renderPrestations(window.prestationsList, currentFilter);
  closeCartModal();
  
  // Ouvrir WhatsApp
  window.open(url, '_blank');
  
  showToast('📱 Redirection vers WhatsApp...', 'success');
}

// Événements DOM
document.addEventListener('DOMContentLoaded', initApp);
document.getElementById('cart-fab')?.addEventListener('click', openCartModal);
