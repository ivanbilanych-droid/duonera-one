const CACHE_NAME = 'duonera-v26-clean-ui';
const CORE_FILES = [
  '/',
  '/index.html',
  '/v2.css?v=25',
  '/v2.js?v=24',
  '/v2-app.html',
  '/v2-app.css?v=24',
  '/v2-app.js?v=24',
  '/admin.html',
  '/privacy.html',
  '/terms.html',
  '/pwa-install.css?v=24',
  '/pwa-install.js?v=24',
  '/registration-photo.js?v=24',
  '/member-auth.js?v=24',
  '/member-bootstrap.js?v=24',
  '/supabase-client.js?v=24',
  '/assets/duonera-v2-hero-approved.webp',
  '/assets/duonera-v2-mark.svg?v=2',
  '/assets/duonera-app-icon-180.png',
  '/assets/duonera-app-icon-192.png',
  '/assets/duonera-app-icon-512.png'
];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(CORE_FILES.map(file => cache.add(file)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => { const copy=response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(request,copy)); return response; }).catch(async () => (await caches.match(request)) || (await caches.match('/index.html')) || new Response('DUONERA je momentálně offline.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));
    return;
  }
  event.respondWith(fetch(request).then(response => { if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));} return response; }).catch(() => caches.match(request)));
});