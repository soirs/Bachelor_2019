const workboxBuild = require('workbox-build');
// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.injectManifest({
    swSrc: 'src/sw-template.js', // this is the sw template file
    swDest: 'build/sw.js', // this will be created in the build step
    globDirectory: 'build',
    globPatterns: [
      '**/*.{js,css,html,json}',
    ],
  }).then(({ count, size, warnings }) => {
    // Optionally, log any warnings and dasetails.
    warnings.forEach(console.warn);
    console.log(`⏺  ${count} files will be precached, totaling ${size} bytes.`);
  }).catch((err) => {
    console.error(`❗️❗️❗️Unable to generate a new service worker.`, err);
  });
}
buildSW();