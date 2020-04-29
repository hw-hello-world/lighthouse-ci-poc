module.exports = {
  "ci": {
    "collect": {
      "startServerCommand": "cd lighthouse-demo-app && yarn start-prod",
      "numberOfRuns": 1,
      "url": [
        "http://localhost:5000/",
      ],
      "settings": {
        "configPath": "./lighthouse-custom-config.js",
      }
    },
    "assert": {
      preset: "lighthouse:recommended",
      //"budgetsFile": "./path/to/budgets.json"
    }
  }
};
