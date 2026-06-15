// Service Worker basique pour cache offline
const CACHE_NAME = 'nails-lash-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/assets/css/reset.css',
  '/assets/css/variables.css',
  '/assets/css/components.css',
  '/assets/css/main.css',
  '/js/config.js',
  '/js/storage.js',
  '/js/ui.js',
  '/js/app.js',
  '/data/prestations.json',
  '/config.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
