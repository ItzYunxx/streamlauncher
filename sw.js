const CACHE = 'streamlauncher-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Ne pas cacher les requêtes vers les sites de streaming
  const url = new URL(e.request.url);
  const streamingDomains = ['coflix', 'animeovf', 'flemmix', 'crunchyroll'];
  if (streamingDomains.some(d => url.hostname.includes(d))) return;

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
