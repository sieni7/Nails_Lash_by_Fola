// Version améliorée avec accès visible
const galleryImages = [
  { src: "assets/images/flyer.png", alt: "Flyer promotionnel Nails & Lash by Fola" },
  { src: "assets/images/logo.png", alt: "Logo Nails & Lash by Fola" }
  // Ajoutez ici vos photos de réalisations
  // { src: "assets/images/realisation1.jpg", alt: "Réalisation ongles" },
  // { src: "assets/images/realisation2.jpg", alt: "Réalisation cils" }
];

function renderGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) {
    console.warn('⚠️ Gallery container not found');
    return;
  }
  
  if (galleryImages.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  const galleryHTML = `
    <div class="gallery-section" id="gallery-section">
      <div class="gallery-title">
        <span>
          <span>📸</span>
          <span>Nos réalisations</span>
        </span>
        <span class="gallery-arrow">👉</span>
      </div>
      <div class="gallery-scroll" id="gallery-scroll">
        ${galleryImages.map((img, index) => `
          <div class="gallery-item" data-index="${index}">
            <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.src='https://placehold.co/140x140/ECE5DD/075E54?text=Photo'">
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = galleryHTML;
  
  // Ajouter les events après rendu
  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.removeEventListener('click', item._clickHandler);
    const handler = () => {
      const img = galleryImages[idx];
      if (img) openImageModal(img.src);
    };
    item.addEventListener('click', handler);
    item._clickHandler = handler;
  });
  
  console.log('✅ Galerie rendue avec', galleryImages.length, 'images');
}

function openImageModal(src) {
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.innerHTML = `
    <div class="custom-modal-content" style="max-width: 90%; background: transparent; box-shadow: none;">
      <div style="background: white; border-radius: 24px; overflow: hidden;">
        <img src="${src}" style="width:100%; display: block; max-height: 70vh; object-fit: contain;" alt="Réalisation">
        <button class="custom-modal-btn custom-modal-btn-primary" style="margin: 16px; width: calc(100% - 32px); border-radius: 40px;" onclick="this.closest('.custom-modal').remove()">Fermer</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);
}

// Exposer globalement
window.openImageModal = openImageModal;
