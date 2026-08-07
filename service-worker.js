const CACHE_NAME = 'duonera-app-v47';
const CORE_FILES = [
  '/',
  '/index.html',
  '/terms.html',
  '/duonera-legal.css?v=20260807a',
  '/manifest.webmanifest?v=4',
  '/duonera-invitation-v2.css?v=20260806c',
  '/duonera-invitation-v2.js?v=20260807b',
  '/assets/duonera-hero-v2.webp?v=20260806b',
  '/assets/duonera-mark-v2.svg',
  '/assets/favicon.svg',
  '/assets/duonera-avatar.png',
  '/assets/duonera-app-icon-180.png',
  '/assets/duonera-app-icon-192.png',
  '/assets/duonera-app-icon-512.png',
  '/assets/duonera-app-icon-maskable-512.png',
  '/ucet.html',
  '/ucet.css?v=20260807d',
  '/duonera-member-v3.css?v=20260806d',
  '/pwa-install.css?v=3',
  '/pwa-install.js?v=3',
  '/ucet.js?v=27',
  '/profil.html',
  '/profil-v2.css?v=20260805a',
  '/profil-hotovo.html',
  '/dekujeme.html',
  '/admin.html',
  '/admin.css?v=5',
  '/admin.js?v=5',
  '/member-auth.js?v=17',
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
            new Response('DUONERA je momentálně offline.', { status:503, headers:{'Content-Type':'text/plain; charset=utf-8'} });
        })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
