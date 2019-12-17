/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
if ('function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

  if (workbox) {
    self.addEventListener('install', event => {
      self.skipWaiting();
    });
    
    workbox.precaching.precacheAndRoute([]);

    console.log('Success 🎉 🎉 🎉 Workbox is running');
  } else {
    console.log('Workbox could not be loaded. No Offline support ❌');
  }
}