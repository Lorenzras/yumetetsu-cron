import {Browser} from 'puppeteer';
import {logger} from '../../../utils';
import {browserURL} from './config';
import UserAgent from 'user-agents';
import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(stealthPlugin());

interface OpenBrowserParam {
  loadImages?: boolean,
  slowMo?: number
}

const getPage = async (browser: Browser) => {
  const pages = await browser.pages();
  return pages.length > 0 ? pages[0] : browser.newPage();
};

logger.info(`Running in ${process.env.NODE_ENV}`);

export const launchBrowser = ({
  slowMo = 0,
}) => {
  logger.info(`Launching browser. `);
  return puppeteer.launch({
    slowMo,
    defaultViewport: null,
    headless: process.env.BROWSER_TYPE === 'HEADLESS',
  });
};

export const openBrowserPage = async (opt?: OpenBrowserParam) => {
  logger.info('Opening page.');
  const browser = await launchBrowser({
    slowMo: opt?.slowMo,
  });
  const page = await getPage(browser);

  const newUserAgent = new UserAgent({
    deviceCategory: 'desktop',
  }).data.userAgent;

  // eslint-disable-next-line max-len
  await page.setUserAgent(newUserAgent);
  logger.info(`Browser agent is ${newUserAgent}` );

  console.log(opt?.loadImages);
  if (opt && !opt.loadImages) {
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
