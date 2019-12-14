const workboxBuild = require('workbox-build');
// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.injectManifest({
    swSrc: 'src/sw-template.js', // this is the sw template file
    swDest: 'build/sw.js', // this will be created in the build step
    globDirectory: 'build',
    globPatterns: [
      '**/*.{js,css,html,json}', // filetypes to precache
    ],
  }).then(({ count, size, warnings }) => {
    /*  Log any warnings and details - makes it easier to debug */
    warnings.forEach(console.warn);
    console.log(`⏺  ${count} files will be precached, totaling ${size} bytes.`);
  }).catch((err) => {
    console.error(`❗️❗️❗️Unable to generate a new service worker❗️❗️❗️`, err);
  });
}
buildSW();