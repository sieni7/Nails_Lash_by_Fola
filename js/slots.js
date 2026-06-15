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
  // Mettre à jour l'affichage
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
        <div class="custom-modal-icon">📅</div>
        <div class="custom-modal-title">Choisissez votre créneau</div>
        <div class="custom-modal-message">Sélectionnez une heure pour votre rendez-vous</div>
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
    if(typeof showCustomModal === 'function') showCustomModal("⚠️", "Date manquante", "Veuillez sélectionner une date");
    else alert("Veuillez sélectionner une date");
    return;
  }
  
  if (!selectedSlot) {
    if(typeof showCustomModal === 'function') showCustomModal("⚠️", "Créneau manquant", "Veuillez sélectionner un créneau horaire");
    else alert("Veuillez sélectionner un créneau horaire");
    return;
  }
  
  // Stocker les infos pour la commande
  window.appointmentDate = date;
  window.appointmentSlot = selectedSlot;
  
  closeDateTimeModal();
  if(typeof showCustomModal === 'function') {
      showCustomModal("✅", "Rendez-vous enregistré", `${date} à ${selectedSlot}`, "success");
  } else {
      alert(`Rendez-vous enregistré: ${date} à ${selectedSlot}`);
  }
}

function generateWhatsAppMessageWithSlot(panier, total) {
  const date = window.appointmentDate || "à préciser";
  const slot = window.appointmentSlot || "à préciser";
  
  let message = `*🛍️ NOUVELLE COMMANDE - Nails & Lash by Fola*%0A%0A`;
  message += `*📋 Prestations sélectionnées :*%0A`;
  
  panier.forEach((item, index) => {
    message += `${index + 1}. ${item.nom} - ${item.prix_texte}%0A`;
  });
  
  message += `%0A*💰 Total : ${total.toLocaleString()} FCFA*%0A%0A`;
  message += `📅 Rendez-vous : ${date} à ${slot}%0A`;
  message += `👤 Nom du client : (à compléter)%0A`;
  message += `📞 Téléphone : (votre numéro)%0A%0A`;
  message += `📍 Adresse : 947G+5FX, Bingerville%0A`;
  message += `_Merci de confirmer ma commande_ 🙏`;
  
  return message;
}
