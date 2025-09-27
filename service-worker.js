// Nombre del caché. Incrementa el número si realizas cambios grandes en los archivos.
const CACHE_NAME = 'mi-pwa-cache-v1';

// Lista de archivos esenciales para que la app funcione offline.
// Deben coincidir con las rutas en tu servidor (o GitHub Pages).
const urlsToCache = [
    '/', // La raíz de la aplicación (index.html)
    '/index.html',
    '/app-manifest.json'
    // Puedes añadir más archivos (CSS, JS, imágenes) aquí si los usas.
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando y cacheando archivos...');
    // Esperamos hasta que se complete la apertura y el llenado del caché.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando shell de la aplicación');
                return cache.addAll(urlsToCache);
            })
    );
    // Forzamos la activación del nuevo SW inmediatamente.
    self.skipWaiting();
});

// Evento 'activate': Se dispara cuando el Service Worker se activa.
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando y limpiando cachés antiguos...');
    
    // Limpiamos versiones antiguas del caché
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Asegura que el Service Worker tome el control de la página inmediatamente.
    return self.clients.claim();
});

// Evento 'fetch': Intercepta todas las solicitudes de la red.
self.addEventListener('fetch', (event) => {
    // Si la solicitud es para un archivo de la lista, intentamos responder desde el caché primero.
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si encontramos el archivo en caché, lo devolvemos inmediatamente.
                if (response) {
                    console.log('[Service Worker] Sirviendo desde caché:', event.request.url);
                    return response;
                }
                
                // Si no está en caché, hacemos la solicitud normal a la red.
                console.log('[Service Worker] Fetching de la red:', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                 console.error('[Service Worker] Error en el fetch:', error);
            })
    );
});
