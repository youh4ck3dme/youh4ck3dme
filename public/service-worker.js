const CACHE_VERSION = 'v1';
const CACHE_NAME = `riggedguard-cache-${CACHE_VERSION}`;
const ORIGIN = self.location.origin;

const ASSET_MANIFEST = {
  '/index.html': [
    '8Uahgmg6lENYbcBYI4nuPkIcCwDEJjp7YoFLXT+QT/Y=',
    '4pddxkJvvAzeyl6AsxQiNqNrBScsDfgPmXhlg7tGBC4='
  ],
  '/manifest.webmanifest': 'IsJecKKBxxTiAI9bdyX7A+SosdTlS8yiXYObJ0+7Xzk=',
  '/offline.html': 'fY30/uiEAoyZ0/OqvFDT29H+cpNGiNynyl6mgcfbgFM=',
  '/icons/firebyte-logo.svg': 'TKMVpbrPj0QXBnqO1vzkps1PiPuBqukl2Fpp3RmdbSw='
};

class IntegrityError extends Error {
  constructor(url, expected, actual) {
    super(`Integrity check failed for ${url}`);
    this.name = 'IntegrityError';
    this.url = url;
    this.expected = expected;
    this.actual = actual;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      self.skipWaiting();
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        Object.entries(ASSET_MANIFEST).map(async ([path, hash]) => {
          try {
            await cacheAsset(cache, path, hash);
          } catch (error) {
            if (error instanceof IntegrityError) {
              await notifyIntegrityFailure(error);
            }
            throw error;
          }
        })
      );
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== ORIGIN) {
    return;
  }

  const normalizedPath = normalizePath(url.pathname);
  const expectedHash = ASSET_MANIFEST[normalizedPath];

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (expectedHash) {
        const cached = await cache.match(normalizedPath);
        if (cached) {
          try {
            await ensureIntegrity(cached.clone(), expectedHash, normalizedPath);
            return cached;
          } catch (error) {
            if (error instanceof IntegrityError) {
              await notifyIntegrityFailure(error);
            }
            await cache.delete(normalizedPath);
          }
        }

        try {
          const response = await fetchAndVerify(normalizedPath, expectedHash);
          await cache.put(normalizedPath, response.clone());
          return response;
        } catch (error) {
          if (error instanceof IntegrityError) {
            await notifyIntegrityFailure(error);
          }
          if (event.request.mode === 'navigate') {
            const fallback = await cache.match('/offline.html');
            if (fallback) {
              return fallback;
            }
          }
          throw error;
        }
      }

      if (event.request.mode === 'navigate') {
        try {
          return await fetch(event.request);
        } catch (error) {
          const fallback = await cache.match('/offline.html');
          if (fallback) {
            return fallback;
          }
          throw error;
        }
      }

      const cached = await cache.match(event.request);
      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(event.request);
        if (url.origin === ORIGIN) {
          cache.put(event.request, response.clone()).catch(() => {});
        }
        return response;
      } catch (error) {
        if (event.request.destination === 'document') {
          const fallback = await cache.match('/offline.html');
          if (fallback) {
            return fallback;
          }
        }
        throw error;
      }
    })()
  );
});

async function cacheAsset(cache, path, expectedHash) {
  const response = await fetchAndVerify(path, expectedHash);
  await cache.put(path, response.clone());
}

async function fetchAndVerify(path, expectedHash) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Request for ${path} failed with status ${response.status}`);
  }
  await ensureIntegrity(response.clone(), expectedHash, path);
  return response;
}

async function ensureIntegrity(response, expectedHash, url) {
  const buffer = await response.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const actualHash = bufferToBase64(digest);
  if (!matchesExpectedHash(actualHash, expectedHash)) {
    throw new IntegrityError(url, expectedHash, actualHash);
  }
  return actualHash;
}

async function notifyIntegrityFailure(error) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({
      type: 'INTEGRITY_ERROR',
      url: error.url,
      expected: error.expected,
      actual: error.actual
    });
  }
}

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/index.html';
  }
  return pathname;
}

function matchesExpectedHash(actual, expected) {
  if (Array.isArray(expected)) {
    return expected.includes(actual);
  }
  return actual === expected;
}
