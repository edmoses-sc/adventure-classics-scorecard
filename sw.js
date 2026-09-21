/* Quabbin Quest scorecard — offline cache.
   The race runs through country with patchy coverage, so the app has to open
   with no signal at all. Bump CACHE whenever you edit index.html. */
const CACHE = 'qq2026-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=> Promise.all(ASSETS.map(u=> c.add(u).catch(()=>{}))))
      .then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=> Promise.all(ks.filter(k=> k !== CACHE).map(k=> caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  let url;
  try{ url = new URL(req.url); }catch(err){ return; }
  if(url.origin !== location.origin) return;

  /* The page itself: serve from cache immediately so a stop with one bar still
     opens instantly, and refresh the copy in the background for next time. */
  if(req.mode === 'navigate' || req.destination === 'document'){
    e.respondWith(
      caches.match('./index.html').then(cached=>{
        const net = fetch(req).then(r=>{
          if(r && r.ok) caches.open(CACHE).then(c=> c.put('./index.html', r.clone()));
          return r;
        }).catch(()=> null);
        return cached || net.then(r=> r || new Response(
          '<!DOCTYPE html><meta charset="utf-8"><title>Offline</title>' +
          '<p style="font:16px system-ui;padding:24px">Scorecard not cached yet. ' +
          'Open this once where you have a signal.</p>',
          {status:503, headers:{'Content-Type':'text/html; charset=utf-8'}}
        ));
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached=> cached || fetch(req).then(r=>{
      if(r && r.ok && r.type === 'basic') caches.open(CACHE).then(c=> c.put(req, r.clone()));
      return r;
    }))
  );
});
