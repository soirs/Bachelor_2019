/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
if ('function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

  // /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');

    self.addEventListener('install', event => { // fetches newest SW at install
        console.log('skipwaiting 1')
        self.skipWaiting();
    });

    workbox.setConfig({
      debug: true,
      cleanupOutdatedCaches: true
    });

    // Clears cache when messaged
    self.addEventListener('message', (event) => {
      if (event.data === 'clear-cache') {
        expirationPlugin.deleteCacheAndMetadata();
      }
    });

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

    /* ALL PUBLIC FILES */
    workbox.routing.registerRoute(
      /public\/(.*)/,
      new workbox.strategies.NetworkFirst())

    /* custom cache rules*/
    // workbox.routing.registerNavigationRoute('/index.html', {
    //   whitelist: 
    //   blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    // });

    // // Background sync
    // workbox.routing.registerRoute(
    //   new RegExp('/event/'),
    //   new workbox.strategies.CacheFirst({
    //     cacheName: 'events',
    //     plugins: [
    //       new workbox.expiration.Plugin({
    //         maxEntries: 20,
    //         maxAgeSeconds: 24 * 60 * 60 //1 day
    //       }),
    //       new workbox.backgroundSync.Plugin('events', {
    //         maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
    //       })
    //     ]
    //   })
    // );



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

    /* IMAGES & GLYPHTER CACHE */
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