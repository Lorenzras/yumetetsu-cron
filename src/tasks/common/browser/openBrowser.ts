import {Browser, Page} from 'puppeteer';
import {logger} from '../../../utils';
import {browserURL} from './config';
import UserAgent from 'user-agents';
import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import adblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import {Cluster} from 'puppeteer-cluster';


puppeteer.use(stealthPlugin());
puppeteer.use(adblockerPlugin({
  blockTrackers: true,
}));

interface OpenBrowserParam {
  loadImages?: boolean,
  slowMo?: number
  headless?: boolean,
}

export const getExtraPuppeteer = ()=> puppeteer;
export const userAgent = new UserAgent({deviceCategory: 'desktop'});

const getPage = async (browser: Browser) => {
  const pages = await browser.pages();
  return pages.length > 0 ? pages[0] : browser.newPage();
};


export const launchBrowser = ({
  slowMo = 0,
  headless = process.env.BROWSER_TYPE === 'HEADLESS',
}) => {
  logger.info(`Launching browser. `);
  return puppeteer.launch({
    slowMo,
    defaultViewport: null,
    headless: headless,
  });
};

/**
 * Dynamically block images
 * Do not forget to call removeAlllisteners for cleanup.
 * @param page
 * @returns {EventEmitter} The event emitter
 */
export const blockImages = async (page: Page) =>{
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      req.abort();
    } else {
      req.continue();
    }
  });
};

export const openBrowserPage = async (opt?: OpenBrowserParam) => {
  logger.info('Opening page.');
  const browser = await launchBrowser({
    slowMo: opt?.slowMo,
    headless: opt?.headless,
  });
  const page = await getPage(browser);

  console.log('Loading browser with: ', opt);

  const newUserAgent = userAgent.data.userAgent;

  // eslint-disable-next-line max-len
  await page.setUserAgent(newUserAgent);
  logger.info(`Browser agent is ${newUserAgent}` );

  console.log(opt?.loadImages);
  if (opt && !opt.loadImages) {
    console.log('Prevent image download.');
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'image') {
        req.abort();
      } else {
        req.continue();
      }
    });
  }
  return page;
};

/**
 * For testing
 *
 * @return {Promise<puppeteer.Page>} Page
 */
export const openMockBrowserPage = async () => {
  logger.info('Opening mock browser page.');
  const browser = await puppeteer.connect({
    browserURL,
    defaultViewport: null});
  return getPage(browser);
};


export const initCluster = (options: Parameters<typeof Cluster.launch>[0]) => {
  const {
    maxConcurrency,
    puppeteerOptions: {
      slowMo = 0,
      headless = process.env.BROWSER_TYPE === 'HEADLESS',
    } = {},
  } = options;

  return Cluster.launch({
    puppeteer: getExtraPuppeteer(),
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: maxConcurrency || +process.env.CLUSTER_MAXCONCURRENCY || 5,
    // monitor: true,
    workerCreationDelay: 100,

    puppeteerOptions: {
      slowMo: slowMo,
      headless: headless,
    // args: minimalArgs,
    },
    retryLimit: 2,
    retryDelay: 20000,
    timeout: 1000 * 60 * 8,
  });
};
