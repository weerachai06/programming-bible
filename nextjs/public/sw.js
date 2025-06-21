const CACHE_NAME = "react-design-patterns-development-0.1.0-20250621T190543";

const urlsToCache = ["/", "/favicon.ico", "/globe.svg"];

self.addEventListener("install", (event) => {
  console.log("🚀 Service Worker installing with cache:", CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Opened cache:", CACHE_NAME);
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("❌ Failed to cache resources:", error);
        return Promise.allSettled(
          urlsToCache.map((url) =>
            cache
              .add(url)
              .catch((err) => console.error(`❌ Failed to cache ${url}:`, err))
          )
        );
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log("⚡ Serving from cache:", event.request.url);
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const responseToCache = response.clone();

          // Cache Next.js static assets and public files
          if (
            event.request.url.includes("/_next/static/") ||
            event.request.url.includes("/favicon.ico") ||
            event.request.url.includes("/globe.svg") ||
            event.request.url.endsWith(".css")
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
              console.log("💾 Cached:", event.request.url);
            });
          }

          return response;
        });
      })
      .catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activating with cache:", CACHE_NAME);
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("🗑️ Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
