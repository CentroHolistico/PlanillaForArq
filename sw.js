// Archivo: sw.js
const CACHE_NAME = 'planilla-cache-v1';
// Lista de todos los archivos que componen tu App Web
const urlsToCache = [
  './', 
  'index.html',
  'manifest.json',
  'sw.js', 
  'icon-192x192.png', 
  'icon-512x512.png'
  // Si usas archivos CSS o JS externos, agrégalos aquí:
  // 'styles.css',
  // 'app.js' 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache Abierto. Archivos precargados para uso offline.');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso de caché si está disponible
        if (response) {
          return response;
        }
        // Si no está en caché, va a la red
        return fetch(event.request);
      })
  );
});