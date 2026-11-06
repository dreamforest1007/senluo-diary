/* 森羅生活：僅快取此網站必要的靜態檔案；個人資料僅保留在瀏覽器 localStorage。 */
const CACHE_NAME = 'sylva-life-static-v24-v1210-weekly-events';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest?v=5.0.1', './v3.js?v=12.1.0', './v3.css?v=10.3.0', './finance-categories.js?v=1.0.0',
  './icon-192-v5.png?v=5.0.1', './icon-512-v5.png?v=5.0.1',
  './icon-maskable-512-v5.png?v=5.0.1', './apple-touch-icon-v5.png?v=5.0.1'
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
