import {Page, ElementHandle} from 'puppeteer';

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
