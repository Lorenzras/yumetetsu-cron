import {userAgent} from './../tasks/common/browser/openBrowser';
import {Page, ElementHandle} from 'puppeteer';
import axios from 'axios';

/**
 * Get text by xpath.
 * I still need to refactor this ~ Lenz
 *
 * @param page Page instance
 * @param xPath valid string
 * @param el Optional Element handler if iterating an array of nodes,
 * faster than searching entire DOM each time
 * @returns {string} the text inside the element
 */
export const getTextByXPath = async (
  page: Page, xPath: string, el: ElementHandle) => {
  // console.log((await el.$x(xPath)).length);

  return (el ?? page)
    .$x(xPath)
    .then(([xEl]) => page.evaluate((ch)=>{
      // console.log(ch);
      return (ch as HTMLElement)?.innerText ?? '';
    }, xEl));
};


export const select = (
  {page, selector, value} :
  {
    page: Page,
    selector: string
    value: string
  },
) => page.$eval(
  selector,
  (el, value) => (<HTMLSelectElement>el).value = <string>value,
  value,
);

export const getHTML = async (
  {url, page}:
  {url: string, page?: Page}) => {
  const ua = page ? await page.browser().userAgent() : userAgent.data.userAgent;
  const htmlBody = await axios(
    url,
    {headers: {'User-Agent': ua}},
  )
    .then((resp) => resp.data)
    .catch((err: any) => {
      throw new Error(`Failed to retrieve DOM ${url} ${err.message}}`);
    });

  return htmlBody;
};
