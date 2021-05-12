/* eslint-disable no-restricted-globals */

const pkg = require('../package.json');

const cacheName = pkg.version;

const thingsToCache = [
  '/',
  './index.html',
  './favicon.df682a99.ico',
  './manifest.webmanifest',
  /* the following are generated by parcel, 
  the "hash" stays the same between builds */
  './src.e31bb0bc.js',
  './src.e31bb0bc.js',
  './Hangboard.d9944ffe.js',
  './Ticks.10a123c3.js',
  './icon-384x384.d09a334c.png',
  './Jobs.e2dfc91e.js',
  './icon-512x512.252f649a.png',
  './icon-192x192.f403002e.png',
  './icon-256x256.994a80ea.png',
  './Account.bc5f8e7c.js',
  './Register.f73ddfa9.js',
  './Users.97aa9fe1.js',
  './LogIn.4cb482ba.js',
  './ResetPassword.534ab9b0.js',
  './favicon.6d47dbe5.png',
  './ForgotPassword.e5ec98f1.js',
  './TickEdit.915f16b6.js',
  './TickCreate.cc52aacd.js',
  './service-worker.js',
  './index.html',
];

// perf critical bits -- if have cached version, serve cached version
const alwaysCache = [
  /* nothing here yet */
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(thingsToCache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  // do cleanup of stale cache
  event.waitUntil(
    (async () => {
      const promises = (await caches.keys()).map((maybeStale) =>
        maybeStale !== cacheName ? caches.delete(maybeStale) : null,
      );
      await Promise.all(promises);
    })(),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      const { pathname } = new URL(e.request.url);
      const isAlwaysCache = alwaysCache.includes(`.${pathname}`);
      const returnCachedAsset = () =>
        caches
          .open(cacheName)
          .then((cache) => cache.match(e.request), { ignoreSearch: true })
          .then((res) => res);

      // if is always cache, hit the cache
      if (isAlwaysCache) {
        return returnCachedAsset();
      }

      // otherwise, hit network and use returnCachedAsset if it fails
      return fetch(e.request).catch(returnCachedAsset);
    })(),
  );
});

/* eslint-enable no-restricted-globals */