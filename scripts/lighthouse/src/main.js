const fs = require('fs');
const R = require('ramda');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { URL } = require('url');
const lighthouseConfig = require('./lighthouse-config.js');

// Metrics we care
const categories = [
  'performance',
  'accessibility',
  'best-practices'
];

const audits = [
  'first-contentful-paint',
  'speed-index',
  'interactive',
  'max-potential-fid',
  'total-blocking-time',
];

// Test Org
const oktaTenant = 'https://00.trexcloud.com/';
const oktaTenantURL = new URL(oktaTenant);
const usernames = [
  'user0app@00.trexcloud.com',
  'user10app@00.trexcloud.com',
  'user50app@00.trexcloud.com',
  'user100app@00.trexcloud.com',
  'user200app@00.trexcloud.com',
  'user500app@00.trexcloud.com',
];

if (!process.env.ADMIN_PWD) {
  console.log('ADMIN_PWD is not set hence halts the program.');
  process.exit(1);
}
const password = process.env.ADMIN_PWD;


const resultDump = '.lighthouseci';

if (!fs.existsSync(resultDump)){
  fs.mkdirSync(resultDump);
}


// Use puppeteer to open Chrome and run lighthouse.
const main = (async (username) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const url = oktaTenant;
  const page = await browser.newPage();
  await page.goto(oktaTenant);
  await page.type('#okta-signin-username', username);
  await page.type('#okta-signin-password', password);
  await page.click('[type="submit"]');
  await page.waitForNavigation();

  const lighthouseFlags = {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'json',
    logLevel: 'info',
  };
  const {lhr} = await lighthouse(url, lighthouseFlags, lighthouseConfig);

  await browser.close();

  // save the entire lighthouse audit result.
  // TODO how useful?
  fs.writeFileSync(`${resultDump}/${oktaTenantURL.hostname}-${username}-${Date.now()}.json`, JSON.stringify(lhr, null, 2));

  return {
    username: `${username}`,
    scores: R.compose(
      R.map(R.multiply(100)),
      R.map(R.prop('score')),
      R.pick(categories),
      R.prop('categories'),
    )(lhr),
    audits: R.compose(
      R.map(R.prop('displayValue')),
      R.pick(audits),
      R.prop('audits'),
    )(lhr),
  };
});

// Generates result in CSV format.
(async () => {
  const result = [];
  for (let i = 0; i < usernames.length; i++) {
    let s = await main(usernames[i]);
    result.push(s);
  }

  // Maybe use a CSV npm module.
  const csvRows = result.map(r => {
    const categoriesScores = categories.map(c => r.scores[c]).join(', ');
    const auditScores = audits.map(a => r.audits[a]).join(', ');
    return `${r.username}, ${categoriesScores}, ${auditScores}`;
  });
  csvRows.unshift(`Users, ${categories.join(', ')}, ${audits.join(', ')}`);

  const csvFileName = `${oktaTenantURL.hostname}-${Date.now()}.csv`;
  fs.writeFileSync(csvFileName, csvRows.join('\r\n'));
  console.log(`>>> Metric has been saved to ${csvFileName}. <<<`);
})();
