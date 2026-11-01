/* 森羅生活：僅快取此網站必要的靜態檔案；個人資料僅保留在瀏覽器 localStorage。 */
const CACHE_NAME = 'sylva-life-static-v6-v3-20261101';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest', './v3.js', './v3.css',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(name => name.startsWith('sylva-life-static-') && name !== CACHE_NAME)
           .map(name => caches.delete(name))
    )).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (request.mode === 'navigate' || /\.(?:js|css)$/.test(url.pathname)) {
    event.respondWith(fetch(request).catch(() => caches.match(request.mode === 'navigate' ? './index.html' : request)));
    return;
  }
  event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
});
