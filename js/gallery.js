// Galerie photos - à intégrer dans la page principale
const galleryImages = [
  { src: "assets/images/flyer.png", alt: "Flyer Nails & Lash by Fola" },
  { src: "assets/images/logo.png", alt: "Logo Nails & Lash" }
  // Ajoutez d'autres images ici : realisations_1.jpg, realisations_2.jpg, etc.
];

function renderGallery() {
  if (!document.getElementById('gallery-container')) return;
  
  const galleryHTML = `
    <div class="gallery-section">
      <div class="gallery-title">
        <span>📸</span>
        <span>Nos réalisations</span>
      </div>
      <div class="gallery-scroll" id="gallery-scroll">
        ${galleryImages.map(img => `
          <div class="gallery-item" onclick="openImageModal('${img.src}')">
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.getElementById('gallery-container').innerHTML = galleryHTML;
}

function openImageModal(src) {
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.innerHTML = `
    <div class="custom-modal-content" style="max-width: 90%; background: transparent; box-shadow: none;">
      <div style="background: white; border-radius: 20px; overflow: hidden;">
        <img src="${src}" style="width:100%; display: block;" alt="Réalisation">
        <button class="custom-modal-btn custom-modal-btn-primary" style="margin: 16px; width: calc(100% - 32px);" onclick="this.closest('.custom-modal').remove()">Fermer</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('active'), 10);
}
