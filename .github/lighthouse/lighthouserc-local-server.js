module.exports = {
  "ci": {
    "collect": {
      "startServerCommand": "yarn start-prod",
      "numberOfRuns": 1,
      "url": [
        "http://localhost:5000/",
      ],
      "settings": {
        "configPath": "./github/lighthouse/lighthouse-custom-config.js",
      }
    },
    "assert": {
      preset: "lighthouse:recommended",
      //"budgetsFile": "./path/to/budgets.json"
    }
  }
};
