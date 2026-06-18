const CACHE_NAME = 'penalty-cup-v1';
const ASSETS = [
  './',
  './index.html',
  './bgm.mp3',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Service Worker and cache all vital game assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Worker and clear old versions if you update the code
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-falling-back-to-cache strategy for fast performance
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
