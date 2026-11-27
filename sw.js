/* ホーム画面アプリ用。ページやデータは新しいものを優先(つながらない時だけ保存分)、画像は一度見たものを保存してすばやく出す。ig/ は対象外 */
const VER = "psj-v1";
self.addEventListener("install", e => { e.waitUntil(caches.open(VER).then(c => c.addAll(["./"])).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("psj-") && !k.startsWith(VER)).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  const base = new URL("./", self.registration.scope).pathname;
  if (url.pathname.startsWith(base + "ig/")) return;
  if (/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(url.pathname)) {
    e.respondWith(caches.open(VER + "-img").then(c => c.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }
  e.respondWith(fetch(req).then(res => { if (res.ok) { const cp = res.clone(); caches.open(VER).then(c => c.put(req, cp)); } return res; }).catch(() => caches.match(req).then(hit => hit || caches.match("./"))));
});
