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
       categoriesFilter.className = 'categories-grid';
       mainContent.insertBefore(categoriesFilter, document.getElementById('prestations-container'));
    } else {
       categoriesFilter.className = 'categories-grid';
    }

    renderCategories(window.prestationsList);
    renderPrestations(window.prestationsList);
  }
  
  renderGallery(); // NOUVEAU
  updateOpenStatus();
  
  // Ajouter le clic sur l'avatar (profil WhatsApp)
  const avatar = document.querySelector('.wa-header__avatar');
  if (avatar) {
    avatar.addEventListener('click', () => {
      showCustomModal(
        "ℹ️", 
        "Nails & Lash by Fola", 
        `📍 ${appConfig?.salon.adresse}\n📞 ${appConfig?.salon.whatsapp}\n⏰ Mar-Dim 9h-21h`
      );
    });
  }
  
  console.log('✅ Application prête');
}

function updateOpenStatus() {
    const open = isOpenNow();
    const statusEl = document.querySelector('.wa-header__info .status');
    const placesRestantes = getPlacesRestantes();
    
    if (statusEl) {
        if (open) {
            let statusText = '🟢 En ligne · Ouvert jusqu\'à 21h';
            if (placesRestantes > 0) {
                statusText += ` · 📦 ${placesRestantes}/10 places`;
            } else {
                statusText += ' · ⚠️ Complet aujourd\'hui';
            }
            statusEl.innerHTML = statusText;
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
    showCustomModal("🛒", "Panier vide", "Ajoutez des prestations à votre panier avant de commander");
    return;
  }
  
  if (!commandesDisponibles()) {
    showCustomModal(
      "⚠️", 
      "Complet aujourd'hui", 
      `Nous avons atteint notre limite de ${appConfig?.regles_commande.limite_quotidienne_commandes} commandes pour aujourd'hui.\n\n📅 Réessayez demain (ouverture 9h-21h, mar-dim)`
    );
    return;
  }
  
  if (!isOpenNow()) {
    showCustomModal(
      "⭕", 
      "Salon fermé", 
      `Horaires : Mardi-Dimanche 9h-21h\n\nNous sommes actuellement fermés. Revenez pendant nos horaires d'ouverture.`
    );
    return;
  }
  
  // Vérifier si rendez-vous choisi
  if (!window.appointmentDate || !window.appointmentSlot) {
    showCustomModal(
      "📅", 
      "Créneau horaire requis", 
      "Veuillez sélectionner une date et un créneau horaire pour votre rendez-vous.",
      "warning"
    );
    openDateTimeModal();
    return;
  }
  
  const total = panier.reduce((sum, item) => {
    const prix = typeof item.prix === 'number' ? item.prix : 0;
    return sum + prix;
  }, 0);
  
  const message = generateWhatsAppMessageWithSlot(panier, total);
  const numero = appConfig?.salon.whatsapp || '2250161210647';
  const url = `https://wa.me/${numero}?text=${message}`;
  
  enregistrerCommande(panier, total);
  incrementerCompteurJour();
  viderPanier();
  
  renderPrestations(window.prestationsList, currentFilter);
  closeCartModal();
  updateOpenStatus();
  
  window.open(url, '_blank');
  
  // Réinitialiser les variables de rendez-vous
  window.appointmentDate = null;
  window.appointmentSlot = null;
  
  showCustomModal("✅", "Commande envoyée !", "Vous allez être redirigé vers WhatsApp pour confirmer votre commande.", "success");
}

// Événements DOM
document.addEventListener('DOMContentLoaded', initApp);
document.getElementById('cart-fab')?.addEventListener('click', openCartModal);
