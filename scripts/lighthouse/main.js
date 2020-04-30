const R = require('ramda');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const {URL} = require('url');
const oktaTenant = 'https://00.trexcloud.com/';

const lighthouseConfig = require('./lighthouse-config.js');
const categories = [
  'performance',
  'accessibility',
  'best-practices'
];

const audits = [
  'first-contentful-paint',
  'first-meaningful-paint',
  'speed-index',
  'interactive',
  'first-cpu-idle',
  'max-potential-fid',
];

const usernames = [
  'user0app@00.trexcloud.com',
  'user10app@00.trexcloud.com',
  'user50app@00.trexcloud.com',
  'user100app@00.trexcloud.com',
  'user200app@00.trexcloud.com',
  'user500app@00.trexcloud.com',
];
const password = process.env.ADMIN_PWD;

const main = (async (username) => {
  // Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
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

  return {
    [`${username}`]: {
      scores: R.compose(
        R.map(R.multiply(100)),
        R.map(R.prop('score')),
        R.pick(categories)
      )(lhr.categories),
      audits: R.compose(
        R.map(R.prop('displayValue')),
        R.pick(audits)
      )(lhr.audits),
    }
  };
});

(async () => {
  const result = [];
  for (let i = 0; i < usernames.length-4; i++) {
    let s = await main(usernames[i]);
    result.push(s);
  }
  console.log(JSON.stringify(result, null, 2));
})();
