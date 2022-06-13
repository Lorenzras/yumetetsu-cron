import {launchBrowser} from './../tasks/common/browser/openBrowser';
import puppeteer from 'puppeteer-extra';
import {openMockBrowserPage} from '../tasks/common/browser';
import {browserTimeOut} from '../tasks/common/browser/config';
import {getTextByXPath, select} from './dom';

describe('dom', ()=>{
  test('getTextByXPath', async ()=>{
    const page = await openMockBrowserPage();

    const testEl = (await page.$$('.ListBukken__list'))[1];
    await page.evaluate((el) => el.style.border = '5px solid red', testEl);

    if (!testEl) return;

    const text = await getTextByXPath(
      page, './/dt[contains(text(), "価格")]/following-sibling::dd', testEl,
    );

    console.log(text);

    page.browser().disconnect();
  }, browserTimeOut);
  test('select', async ()=>{
    const page = await puppeteer.launch({
      headless: false,
    })
      .then((b) => b.pages())
      .then(([p] )=> p);

    await page.goto('https://www.w3docs.com/learn-html/html-select-tag.html');

    /*
    await page.waitForSelector('select[aria-label="Books"]')
      .then((s) => s?.select('js')); */


    await select({
      page,
      selector: 'select[aria-label="Books"',
      value: 'php',
    });
    await page.waitForTimeout(5000);

    await page.browser().close();
  }, browserTimeOut);
});

