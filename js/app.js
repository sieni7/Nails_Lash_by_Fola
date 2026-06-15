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
        alert('Votre panier est vide');
        return;
    }
    
    if (!commandesDisponibles()) {
        alert(`⚠️ Désolé, nous avons atteint notre limite de ${appConfig?.regles_commande.limite_quotidienne_commandes} commandes pour aujourd'hui.\n\n📅 Réessayez demain (ouverture 9h-21h, mar-dim)`);
        return;
    }
    
    if (!isOpenNow()) {
        alert('⭕ Le salon est fermé.\n\n📅 Horaires : Mardi-Dimanche 9h-21h');
        return;
    }
    
    // Calculer total
    const total = panier.reduce((sum, item) => {
        const prix = typeof item.prix === 'number' ? item.prix : 0;
        return sum + prix;
    }, 0);
    
    // Générer message WhatsApp
    generateWhatsAppMessage(panier, total);
}

function generateWhatsAppMessage(panier, total) {
    let message = `*🛍️ NOUVELLE COMMANDE - Nails & Lash by Fola*%0A%0A`;
    message += `*📋 Prestations sélectionnées :*%0A`;
    
    panier.forEach((item, index) => {
        message += `${index + 1}. ${item.nom} - ${item.prix_texte}%0A`;
    });
    
    message += `%0A*💰 Total : ${total.toLocaleString()} FCFA*%0A%0A`;
    message += `👤 Nom du client : (à compléter)%0A`;
    message += `📅 Date souhaitée : (jj/mm)%0A`;
    message += `⏰ Horaire : (${appConfig?.horaires?.mardi || '9h-21h'})%0A`;
    message += `📞 Téléphone : (votre numéro)%0A%0A`;
    message += `📍 Adresse : 947G+5FX, Bingerville%0A`;
    message += `_Merci de confirmer ma commande_ 🙏`;
    
    const numero = appConfig?.salon.whatsapp || '2250161210647';
    const url = `https://wa.me/${numero}?text=${message}`;
    
    // Enregistrer la commande dans l'historique
    enregistrerCommande(panier, total);
    
    // Incrémenter compteur
    incrementerCompteurJour();
    
    // Vider panier après commande
    viderPanier();
    renderPrestations(window.prestationsList, currentFilter);
    closeCartModal();
    updateOpenStatus(); // Mettre à jour l'affichage du compteur
    
    // Ouvrir WhatsApp
    window.open(url, '_blank');
    
    const placesRestantes = getPlacesRestantes();
    showToast(`✅ Commande enregistrée ! Plus que ${placesRestantes} places aujourd'hui`, 'success');
}

// Événements DOM
document.addEventListener('DOMContentLoaded', initApp);
document.getElementById('cart-fab')?.addEventListener('click', openCartModal);
