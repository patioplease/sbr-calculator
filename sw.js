const C="sbr-v6";const F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// Online: always fetch the newest version. Offline: use the saved copy.
// If the site has been taken down (404), wipe the saved copy so the app stops working.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request.url,{cache:"no-cache"}).then(r=>{
    if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}
    if(r.status===404&&e.request.mode==="navigate"){return caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))).then(()=>self.registration.unregister()).then(()=>r)}
    return caches.match(e.request,{ignoreSearch:true}).then(m=>m||r);
  }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
