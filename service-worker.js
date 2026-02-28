const CACHE_NAME = "onestep-cache-v1803";
const SW_APP_VERSION = "1.8.3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./privacy.html",
  "./impressum.html",
  "./css/style.css?v=1803",
  "./js/app.js?v=1803",
  "./site.webmanifest?v=1803",
  "./assets/onestep-logo-user.png",
  "./assets/onestep-logo-rounded.png",
];

const OFFLINE_DOCUMENT = "./index.html";

const precacheAppShell = async () => {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    APP_SHELL.map(async (url) => {
      try {
        const request = new Request(url, { cache: "reload" });
        const response = await fetch(request);
        if (response && response.ok) {
          await cache.put(request, response.clone());
        }
      } catch (_err) {
        // Keep installation resilient even with intermittent network hiccups.
      }
    })
  );
};

self.addEventListener("install", (event) => {
  event.waitUntil(precacheAppShell());
  self.skipWaiting();
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

const matchFromCache = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const byRequest = await cache.match(request, { ignoreSearch: true });
  if (byRequest) return byRequest;
  if (request.url) {
    const path = new URL(request.url).pathname;
    const byPath = await cache.match(path, { ignoreSearch: true });
    if (byPath) return byPath;
  }
  return null;
};

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch (_err) {
          const fallback = await matchFromCache(new Request(OFFLINE_DOCUMENT));
          return fallback || Response.error();
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await matchFromCache(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok && fresh.type === "basic") {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (_err) {
        if (request.destination === "style" || request.destination === "script") {
          const fallback = await matchFromCache(new Request(OFFLINE_DOCUMENT));
          return fallback || Response.error();
        }
        return Response.error();
      }
    })()
  );
});
