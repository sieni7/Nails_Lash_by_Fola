// ===== APP.JS - VERSION CORRIGÉE =====
window.prestationsList = [];

async function initApp() {
  console.log('🚀 Démarrage Nails & Lash by Fola');
  
  await loadConfig();
  window.prestationsList = await loadPrestations();
  
  if (window.prestationsList && window.prestationsList.length > 0) {
    console.log(`✅ ${window.prestationsList.length} prestations chargées`);
    renderCategories(window.prestationsList);
    renderPrestations(window.prestationsList, 'Toutes');
  } else {
    console.error('❌ Aucune prestation chargée');
    document.getElementById('prestations-container').innerHTML = 
      '<div style="text-align:center;padding:40px;">Erreur chargement des prestations</div>';
  }
  
  // Initialiser les composants
  if (typeof renderGallery === 'function') {
    renderGallery();
  } else {
    console.warn('⚠️ gallery.js non chargé');
  }
  
  updateOpenStatus();
  setupProfileClick();
  
  console.log('✅ Application prête');
}

function setupProfileClick() {
  const avatar = document.querySelector('.wa-header__avatar');
  if (avatar) {
    avatar.removeEventListener('click', avatar._clickHandler);
    avatar.addEventListener('click', () => {
      showCustomModal(
        "ℹ️", 
        "Nails & Lash by Fola", 
        `📍 Bingerville, Côte d'Ivoire\n📞 +225 01 61 21 06 47\n⏰ Mardi-Dimanche 9h-21h\n\n✨ Révélez votre beauté, affirmez votre style`
      );
    });
    console.log('✅ Clic profil activé');
  }
}

function updateOpenStatus() {
  const open = isOpenNow();
  const statusEl = document.querySelector('.wa-header__info .status');
  const placesRestantes = typeof getPlacesRestantes === 'function' ? getPlacesRestantes() : 10;
  
  if (statusEl) {
    if (open) {
      let statusText = "🟢 En ligne · Ouvert jusqu'à 21h";
      if (placesRestantes > 0 && placesRestantes < 10) {
        statusText += ` · 📦 ${placesRestantes}/10 places`;
      } else if (placesRestantes === 0) {
        statusText += " · ⚠️ Complet aujourd'hui";
      }
      statusEl.innerHTML = statusText;
    } else {
      statusEl.innerHTML = '⭕ Fermé · Mar-Dim 9h-21h';
    }
  }
}

async function validateAndOrder() {
  const panier = getPanier();
  
  if (panier.length === 0) {
    showCustomModal("🛒", "Panier vide", "Ajoutez des prestations à votre panier avant de commander");
    return;
  }
  
  if (typeof commandesDisponibles === 'function' && !commandesDisponibles()) {
    showCustomModal("⚠️", "Complet aujourd'hui", "Limite de 10 commandes atteinte pour aujourd'hui.");
    return;
  }
  
  if (!isOpenNow()) {
    showCustomModal("⭕", "Salon fermé", "Horaires : Mardi-Dimanche 9h-21h");
    return;
  }
  
  // Vérifier créneau
  if (!window.appointmentDate || !window.appointmentSlot) {
    showCustomModal("📅", "Créneau requis", "Veuillez sélectionner une date et un créneau horaire.");
    if (typeof openDateTimeModal === 'function') openDateTimeModal();
    return;
  }
  
  const total = panier.reduce((sum, item) => {
    const prix = typeof item.prix === 'number' ? item.prix : 0;
    return sum + prix;
  }, 0);
  
  let message = `*🛍️ NOUVELLE COMMANDE - Nails & Lash by Fola*%0A%0A`;
  message += `*📋 Prestations :*%0A`;
  panier.forEach((item, index) => {
    message += `${index + 1}. ${item.nom} - ${item.prix_texte}%0A`;
  });
  message += `%0A*💰 Total : ${total.toLocaleString()} FCFA*%0A`;
  message += `📅 Rendez-vous : ${window.appointmentDate} à ${window.appointmentSlot}%0A%0A`;
  message += `📍 ${appConfig?.salon?.adresse || '947G+5FX, Bingerville'}%0A`;
  message += `_Merci de confirmer_ 🙏`;
  
  const numero = appConfig?.salon?.whatsapp || '2250161210647';
  const url = `https://wa.me/${numero}?text=${message}`;
  
  if (typeof enregistrerCommande === 'function') enregistrerCommande(panier, total);
  if (typeof incrementerCompteurJour === 'function') incrementerCompteurJour();
  if (typeof viderPanier === 'function') viderPanier();
  
  if (typeof renderPrestations === 'function' && window.prestationsList) {
    renderPrestations(window.prestationsList, 'Toutes');
  }
  if (typeof closeCartModal === 'function') closeCartModal();
  if (typeof updateOpenStatus === 'function') updateOpenStatus();
  
  window.appointmentDate = null;
  window.appointmentSlot = null;
  
  window.open(url, '_blank');
  showCustomModal("✅", "Commande envoyée !", "Redirection vers WhatsApp...", "success");
}

// Exposer globalement
window.initApp = initApp;
window.validateAndOrder = validateAndOrder;
