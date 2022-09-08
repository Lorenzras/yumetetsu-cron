import {ElementHandle, Page} from 'puppeteer';

export const scrollToEl = async (page: Page, el: ElementHandle ) =>
  await page.evaluate(
    (el)=> {
      el.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      });
    }, el,
  );
