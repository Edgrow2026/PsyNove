const CACHE_NAME = 'psynova-v2';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  '/manifest.json',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Warm up cache
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.error("SW: caching assets failed", err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // CRITICAL SECURITY CONSTRAINT: Never cache authenticated areas or sensitive state
  if (
    url.pathname.startsWith('/api/') || 
    url.pathname.startsWith('/_next/') ||
    url.pathname.includes('dashboard') || 
    url.pathname.includes('admin') || 
    event.request.method !== 'GET'
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For app pages, use network-first so dev/tunnel sessions do not serve an
  // old HTML shell with missing Next.js chunks, which makes buttons look dead.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and refresh in background for static assets
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Ignore network errors on background refresh */});

        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Return cached static route if available
        return caches.match(OFFLINE_URL).then((offlineResponse) => {
          if (offlineResponse) return offlineResponse;
          
          // Generic fallback text
          return new Response(
            `<!DOCTYPE html>
            <html lang="si">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>PsyNova - Offline</title>
              <style>
                body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #0f172a; color: #f8fafc; }
                h1 { font-size: 2rem; color: #38bdf8; }
                p { color: #94a3b8; }
              </style>
            </head>
            <body>
              <h1>PsyNova - ඔබ නොබැඳිව ඇත / ඔබ ஆஃப்லைனில் உள்ளீர்கள் / You are offline</h1>
              <p>කරුණාකර ඔබගේ අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කරන්න.</p>
              <p>தயவுசெய்து உங்கள் இணைய இணைப்பைச் சரிபார்க்கவும்.</p>
              <p>Please check your internet connection.</p>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      });
    })
  );
});
