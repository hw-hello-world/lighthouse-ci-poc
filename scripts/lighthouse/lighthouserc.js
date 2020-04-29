module.exports = {
  "ci": {
    "collect": {
      "startServerCommand": "cd ../../ && yarn start-prod",
      "numberOfRuns": 1,
      "url": [
        "http://localhost:5000/",
      ],
      "settings": {
        "configPath": "custom-config.js",
      }
    },
    "assert": {
      preset: "lighthouse:no-pwa",
      //"budgetsFile": "./path/to/budgets.json"
      assertions: {
        "uses-long-cache-ttl": "off",
        "uses-http2": "off",

        // seo
        'viewport': 'off',
        'document-title': 'off',
        'meta-description': 'off',
        'http-status-code': 'off',
        'link-text': 'off',
        'is-crawlable': 'off',
        'robots-txt': 'off',
        'image-alt': 'off',
        'hreflang': 'off',
        'canonical': 'off',
        'font-size': 'off',
        'plugins': 'off',
        'tap-targets': 'off',
        'structured-data': 'off',

      }
    }
  }
};
