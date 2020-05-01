//
// https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md
// https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/default-config.js

module.exports = {
  extends: 'lighthouse:default',
  settings: {

    emulatedFormFactor: "desktop",

    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      // 'pwa',
      // 'seo'
    ],

    skipAudits: [
      'first-meaningful-paint',
      'first-cpu-idle'
    ],
  },
};
