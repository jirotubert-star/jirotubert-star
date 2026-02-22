const CACHE_NAME = "onestep-cache-v1741";
const SW_APP_VERSION = "1.7.41";
const APP_SHELL = [
  "./",
  "./index.html",
  "./privacy.html",
  "./impressum.html",
  "./css/style.css",
  "./css/style.css?v=1741",
  "./js/app.js",
  "./js/app.js?v=1741",
  "./site.webmanifest",
  "./site.webmanifest?v=1741",
  "./assets/onestep-logo-user.png",
  "./assets/onestep-logo-rounded.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (event.data?.type === "GET_SW_VERSION") {
    const replyPort = event.ports?.[0];
    if (replyPort) {
      replyPort.postMessage({ version: SW_APP_VERSION });
    }
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
