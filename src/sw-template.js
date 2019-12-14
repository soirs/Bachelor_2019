/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
if ('function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

  // /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');

    self.addEventListener('install', event => { // fetches newest SW at install
        self.skipWaiting();
    });

    workbox.setConfig({
      debug: true,
      cleanupOutdatedCaches: true
    });

    /* Injection point for manifest files. Creates all the paths to precache based on settings in /sw-build.js */
    workbox.precaching.precacheAndRoute([]);

    /* Caches all files in the /public folder and prioritizes fresh data */
    workbox.routing.registerRoute(
      /public\/(.*)/,
      new workbox.strategies.NetworkFirst())

    // STATIC RESSOURCES 
    workbox.routing.registerRoute(
      /\.(?:js|css)$/,
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 14 * 24 * 60 * 60, // 14 Days
            purgeOnQuotaError: true,
          }),
        ],
      })
    );

    /* IMAGE CACHE */
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg|ico)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'images-cache',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 300 * 24 * 60 * 60, // 300 Days 
            purgeOnQuotaError: true,
          }),
        ],
      })
    );

    workbox.routing.registerRoute(
      /\.(?:woff|woff2)$/,
      new workbox.strategies.CacheFirst({
        cacheName: 'font-cache',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 300 * 24 * 60 * 60, // 300 Days 
            purgeOnQuotaError: true,
          }),
        ],
      })
    );

    console.log('🎉 🎉 🎉 🎉 🎉 🎉 ');

  } else {
    console.log('Workbox could not be loaded. No Offline support ❌');
  }
}