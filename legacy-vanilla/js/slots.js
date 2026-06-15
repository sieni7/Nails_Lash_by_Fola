// Assurer que showCustomModal est disponible
function showCustomModal(icon, title, message, type = "warning") {
  // Vérifier si la fonction existe dans ui.js
  if (typeof window.showCustomModal === 'function') {
    window.showCustomModal(icon, title, message, type);
    return;
  }
  
  // Fallback si la fonction n'est pas encore chargée
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.innerHTML = `
    <div class="custom-modal-content">
      <div class="custom-modal-header">
        <div class="custom-modal-icon">${icon}</div>
        <div class="custom-modal-title">${title}</div>
        <div class="custom-modal-message">${message}</div>
      </div>
      <div class="custom-modal-actions">
        <button class="custom-modal-btn custom-modal-btn-primary" onclick="this.closest('.custom-modal').remove()">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);
}

// Exporter la fonction globalement
window.showCustomModal = showCustomModal;

let selectedSlot = null;
let currentDate = null;

function getAvailableSlots(date) {
  const commandes = typeof getCommandesHistory === 'function' ? getCommandesHistory() : [];
  const reservedSlots = commandes
    .filter(cmd => cmd.date && cmd.date.startsWith(date))
    .map(cmd => cmd.slot);
  
  return (appConfig?.creneaux?.liste || []).filter(slot => !reservedSlots.includes(slot));
}

function renderSlotSelector() {
  const dateInput = document.getElementById('appointment-date');
  const dateToUse = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
  
  const availableSlots = getAvailableSlots(dateToUse);
  const allSlots = appConfig?.creneaux?.liste || [];
  
  return `
    <div class="slot-selector" id="slot-selector">
      ${allSlots.map(slot => {
        const isAvailable = availableSlots.includes(slot);
        return `
        <div class="slot-option ${selectedSlot === slot ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}" 
             data-slot="${slot}"
             onclick="${isAvailable ? `selectSlot('${slot}')` : ''}">
          ${slot}
        </div>
      `}).join('')}
    </div>
  `;
}

function selectSlot(slot) {
  selectedSlot = slot;
  // Mettre Ã  jour l'affichage
  document.querySelectorAll('.slot-option').forEach(el => {
    if (el.dataset.slot === slot) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
}

function openDateTimeModal() {
  const todayStr = new Date().toISOString().split('T')[0];
  currentDate = todayStr;
  
  const modalContent = `
    <div class="custom-modal-content" style="max-width: 400px;">
      <div class="custom-modal-header">
        <div class="custom-modal-icon">ðŸ“…</div>
        <div class="custom-modal-title">Choisissez votre crÃ©neau</div>
        <div class="custom-modal-message">SÃ©lectionnez une heure pour votre rendez-vous</div>
      </div>
      <div style="padding: 0 var(--space-md);">
        <input type="date" id="appointment-date" min="${todayStr}" value="${todayStr}"
               style="width:100%; padding:12px; border-radius:12px; border:1px solid var(--gray-300); margin-bottom:16px;">
        <div id="slot-container">${renderSlotSelector()}</div>
      </div>
      <div class="custom-modal-actions">
        <button class="custom-modal-btn custom-modal-btn-secondary" onclick="closeDateTimeModal()">Annuler</button>
        <button class="custom-modal-btn custom-modal-btn-primary" onclick="confirmDateTime()">Confirmer</button>
      </div>
    </div>
  `;
  
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.id = 'datetime-modal';
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);
  
  const dateInput = document.getElementById('appointment-date');
  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      currentDate = e.target.value;
      selectedSlot = null; // reset slot on date change
      document.getElementById('slot-container').innerHTML = renderSlotSelector();
    });
  }
}

function closeDateTimeModal() {
  const modal = document.getElementById('datetime-modal');
  if (modal) modal.remove();
}

function confirmDateTime() {
  const date = document.getElementById('appointment-date')?.value;
  if (!date) {
    if(typeof showCustomModal === 'function') showCustomModal("âš ï¸", "Date manquante", "Veuillez sÃ©lectionner une date");
    else alert("Veuillez sÃ©lectionner une date");
    return;
  }
  
  if (!selectedSlot) {
    if(typeof showCustomModal === 'function') showCustomModal("âš ï¸", "CrÃ©neau manquant", "Veuillez sÃ©lectionner un crÃ©neau horaire");
    else alert("Veuillez sÃ©lectionner un crÃ©neau horaire");
    return;
  }
  
  // Stocker les infos pour la commande
  window.appointmentDate = date;
  window.appointmentSlot = selectedSlot;
  
  closeDateTimeModal();
  if(typeof showCustomModal === 'function') {
      showCustomModal("âœ…", "Rendez-vous enregistrÃ©", `${date} Ã  ${selectedSlot}`, "success");
  } else {
      alert(`Rendez-vous enregistrÃ©: ${date} Ã  ${selectedSlot}`);
  }
}

function generateWhatsAppMessageWithSlot(panier, total) {
  const date = window.appointmentDate || "Ã  prÃ©ciser";
  const slot = window.appointmentSlot || "Ã  prÃ©ciser";
  
  let message = `*ðŸ›ï¸ NOUVELLE COMMANDE - Nails & Lash by Fola*%0A%0A`;
  message += `*ðŸ“‹ Prestations sÃ©lectionnÃ©es :*%0A`;
  
  panier.forEach((item, index) => {
    message += `${index + 1}. ${item.nom} - ${item.prix_texte}%0A`;
  });
  
  message += `%0A*ðŸ’° Total : ${total.toLocaleString()} FCFA*%0A%0A`;
  message += `ðŸ“… Rendez-vous : ${date} Ã  ${slot}%0A`;
  message += `ðŸ‘¤ Nom du client : (Ã  complÃ©ter)%0A`;
  message += `ðŸ“ž TÃ©lÃ©phone : (votre numÃ©ro)%0A%0A`;
  message += `ðŸ“ Adresse : 947G+5FX, Bingerville%0A`;
  message += `_Merci de confirmer ma commande_ ðŸ™`;
  
  return message;
}


