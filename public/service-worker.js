const CACHE_NAME = 'riggedguard-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/offline.html',
  '/integrity-manifest.json',
];
let integrityManifest = null;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        try {
          await verifyResponseIntegrity(request, cachedResponse.clone());
        } catch (error) {
          await cache.delete(request);
          return caches.match('/offline.html');
        }
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        const responseClone = networkResponse.clone();
        await verifyResponseIntegrity(request, responseClone);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        return cachedResponse || (await caches.match('/offline.html'));
      }
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

async function loadIntegrityManifest() {
  if (integrityManifest) {
    return integrityManifest;
  }
  try {
    const response = await fetch('/integrity-manifest.json');
    if (response.ok) {
      integrityManifest = await response.json();
    } else {
      integrityManifest = {};
    }
  } catch (error) {
    integrityManifest = {};
  }
  return integrityManifest;
}

async function verifyResponseIntegrity(request, response) {
  const manifest = await loadIntegrityManifest();
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  let key = url.pathname.replace(scope.pathname.slice(0, -1), '');
  if (key.startsWith('/')) {
    key = key.slice(1);
  }
  if (key === '') {
    key = '/';
  }
  const expectedHash = manifest[key];
  if (!expectedHash || !response || !response.ok) {
    return response;
  }
  const buffer = await response.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const hash = arrayBufferToBase64(digest);
  if (hash !== expectedHash) {
    await notifyClients('integrity-failure', { url: key, expectedHash, actualHash: hash });
    throw new Error(`Integrity mismatch for ${key}`);
  }
  await notifyClients('integrity-ok', { url: key });
  return response;
}

async function notifyClients(type, payload) {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => client.postMessage({ type, payload }));
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
