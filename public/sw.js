/*
 * Muzej v žepu — service worker muzeja vasi Griblje.
 * Vzorec: multimedijski vodnik Van Goghovega muzeja (deluje brez
 * povezave) in pametni avdio vodnik Metropolitana: obiskovalec si
 * muzej namesti na domači zaslon in ga prehoduje po vasi brez
 * podatkovne povezave.
 *
 * Strategije:
 *  - /_next/static, /images, /icons, logo, manifest → cache-first
 *    (imutabilni viri; hash v imenu zagotavlja svežino)
 *  - /api/audio-guide → cache-first (TTS je dragocen; enkrat poslušan
 *    posnetek ostane na voljo tudi brez povezave)
 *  - drugi /api/* → network-first z zaledjem (zbirka, iskanje, IIIF)
 *  - navigacije → network-first; brez povezave streže predpomnjeno
 *    domačo stran
 */

const VERSION = "mvg-pwa-v1";
const STATIC_CACHE = `mvg-static-${VERSION}`;
const RUNTIME_CACHE = `mvg-runtime-${VERSION}`;
const RUNTIME_CACHE_MAX = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // Predpomni domačo stran; napaka namestitve ni usodna.
      await cache.add("/").catch(() => {});
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => !name.endsWith(VERSION))
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

async function trimRuntimeCache() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const keys = await cache.keys();
    if (keys.length > RUNTIME_CACHE_MAX) {
      await Promise.all(
        keys.slice(0, keys.length - RUNTIME_CACHE_MAX).map((key) => cache.delete(key))
      );
    }
  } catch {
    // nič hudega
  }
}

async function cacheFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
      if (cacheName === RUNTIME_CACHE) await trimRuntimeCache();
    }
    return response;
  } catch (error) {
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) return fallback;
    }
    throw error;
  }
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
      if (cacheName === RUNTIME_CACHE) await trimRuntimeCache();
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) return fallback;
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Avdio vodnik: enkrat pridobljen, vedno na voljo (muzej v žepu).
  if (url.pathname === "/api/audio-guide") {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  // Drugi API-ji: najprej omrežje, ob prekinitvi predpomnilnik.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Imutabilni statični viri.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/logo.svg" ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigacije: najprej omrežje, brez povezave predpomnjena domača stran.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, STATIC_CACHE, "/"));
    return;
  }
});
