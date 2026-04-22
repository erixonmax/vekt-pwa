// vekt PWA Service Worker v7
const CACHE_NAME = 'vekt-pwa-v7';
const STATIC_FILES = [
  '/vekt-pwa/manifest.json',
  '/vekt-pwa/icon-192.png',
  '/vekt-pwa/icon-512.png',
  '/vekt-pwa/apple-touch-icon.png',
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
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request)));
    return;
  }
  if (url.origin !== self.location.origin) return;
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

// ── Push notification handler ─────────────────────────────────────────────
self.addEventListener('push', e => {
  let data = { title: 'vekt', body: 'You have a reminder.' };
  try { data = e.data ? e.data.json() : data; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/vekt-pwa/icon-192.png',
      badge: '/vekt-pwa/icon-192.png',
      vibrate: [200, 100, 200],
      tag: 'vekt-reminder',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('vekt-pwa') && 'focus' in c) return c.focus();
      }
      return clients.openWindow('/vekt-pwa/');
    })
  );
});
