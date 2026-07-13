const CACHE_NAME = 'cascolegal-v14';
const LEGACY_PDF_CACHE_NAME = 'cascolegal-v6';
const PDF_CACHE_PREFIX = 'cascolegal-pdfs-';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/bikers-society-logo.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/pdfjs/pdf.mjs',
  './assets/pdfjs/pdf.worker.mjs'
];

// Instalación: Guardar recursos estáticos básicos
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    console.log('[Service Worker] Caching static assets');
    // Un recurso secundario no debe impedir que el service worker se instale.
    await Promise.all(STATIC_ASSETS.map(async (asset) => {
      try {
        const response = await fetch(asset, { cache: 'no-cache' });
        if (response.ok) await cache.put(asset, response);
      } catch (error) {
        console.warn('[Service Worker] No se pudo precargar:', asset, error);
      }
    }));
  })());
  self.skipWaiting();
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Los PDF offline se gestionan por separado y deben sobrevivir las
          // actualizaciones de la interfaz de la aplicación.
          if (cache !== CACHE_NAME && cache !== LEGACY_PDF_CACHE_NAME && !cache.startsWith(PDF_CACHE_PREFIX)) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar Peticiones: Network-First para HTML, Cache-First para otros estáticos
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First para navegación, manifest y datos que cambian diariamente.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('manifest.json') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  } else {
    // Cache-First para estáticos, imágenes, fuentes y PDFs
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
  }
});
