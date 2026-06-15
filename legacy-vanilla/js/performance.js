// Performance optimizations
(function optimizePerformance() {
  // Lazy loading images
  const images = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }
  
  // Debounce resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate layout if needed
      console.log('Viewport optimized');
    }, 250);
  });
  
  // Vérifier connexion 3G/4G
  if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.saveData) {
      // Mode économie de données
      document.body.classList.add('save-data-mode');
    }
  }
  
  console.log('✅ Performance optimizations loaded');
})();
