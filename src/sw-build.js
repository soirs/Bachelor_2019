const workboxBuild = require('workbox-build');
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.injectManifest({
    swSrc: 'src/sw-template.js',
    swDest: 'build/sw.js',
    globDirectory: 'build',
    globPatterns: [
      // filetypes in the build folder to precache
      '**/*.{js,css,html,json,svg,png,woff2,ico}',
    ],
  }).then(({ count, size, warnings }) => {
    warnings.forEach(console.warn);
    console.log(`⏺ ${count} files will be precached, totaling ${size} bytes.`);
  }).catch((err) => {
    console.error(`❗️❗️❗️Unable to generate a new service worker❗️❗️❗️`, err);
  });
}
buildSW();