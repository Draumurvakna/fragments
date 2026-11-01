/* 恋人絮语展馆 · 离线缓存
 * 改了页面内容后，把 VERSION 改一下，已安装的 App 下次打开就会换成新版本。
 */
const VERSION = 'fragments-v4';
const SHELL = `${VERSION}-shell`, FONTS = 'fragments-fonts', ART = 'fragments-art';
const FILES = ['./', './index.html', './css/style.css', './js/data.js', './js/guides.js', './js/painter.js', './js/app.js',
  './css/fonts.css', './fonts/wenkai-core.woff2', './fonts/xiaowei-core.woff2', './fonts/fell-italic.woff2', './fonts/fell-roman.woff2', './fonts/courier.woff2',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/icon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.endsWith('-shell') && k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function staleWhileRevalidate(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || net;
}
async function networkFirst(req, name) {
  const cache = await caches.open(name);
  try { const res = await fetch(req, { cache: 'no-cache' }); if (res && res.ok) cache.put(req, res.clone()); return res; }
  catch (err) { return (await cache.match(req)) || Response.error(); }
}
async function cacheFirst(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  if (hit) return hit;
  try { const res = await fetch(req); if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }
  catch (err) { return Response.error(); }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(SHELL).then(c => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  if (url.origin === location.origin) { e.respondWith(networkFirst(req, SHELL)); return; }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') { e.respondWith(staleWhileRevalidate(req, FONTS)); return; }
  if (url.hostname.endsWith('wikimedia.org')) { e.respondWith(cacheFirst(req, ART)); return; }
});
