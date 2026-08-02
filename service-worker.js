const CACHE_NAME = 'duonera-app-v8';
const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/styles.css?v=28',
  '/app.js?v=18',
  '/assets/favicon.svg',
  '/assets/duonera-mark.svg',
  '/assets/duonera-avatar.png',
  '/assets/hero-europe-couple-v3.webp',
  '/ucet.html',
  '/ucet.css',
  '/ucet.js',
  '/admin.html',
  '/admin.css?v=5',
  '/admin.js?v=5',
  '/member-auth.js',
  '/supabase-client.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(CORE_FILES.map(file => cache.add(file))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) ||
            (await caches.match('/index.html')) ||
            new Response('DUONERA je momentálně offline.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
