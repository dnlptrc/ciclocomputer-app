
const CACHE_NAME = 'bike-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Instalare: Salvăm fișierele de bază
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Strategie: Cache First, then Network (pentru hărți)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Dacă e în cache, îl dăm de acolo
      if (response) return response;

      // Dacă nu e, îl luăm de pe net și îl salvăm în cache (pentru hărți)
      return fetch(event.request).then((networkResponse) => {
        if (event.request.url.includes('tile.openstreetmap.org')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    })
  );
});
