// vekt PWA Service Worker v4
// index.html is NEVER cached — always fetched fresh from network

const CACHE_NAME = 'vekt-pwa-v5';
const STATIC_FILES = [
  '/vekt-pwa/manifest.json',
  '/vekt-pwa/icon-192.svg',
  '/vekt-pwa/icon-512.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // NEVER cache index.html — always fetch fresh
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request)));
    return;
  }

  // Skip non-same-origin (Supabase API calls etc)
  if (url.origin !== self.location.origin) return;

  // Cache first for static assets only
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (e.request.method === 'GET' && response.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, response.clone()));
        }
        return response;
      });
    })
  );
});
