//
// https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md
// https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/default-config.js

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: [
      'performance',
      'accessibility',
      'best-practices',
      //'pwa'
    ],
    skipAudits: [
      // category: 'best-practices'
      'uses-http2',

      'uses-long-cache-ttl',
    ],
  },
};
