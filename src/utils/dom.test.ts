import {openMockBrowserPage} from '../tasks/common/browser';
import {browserTimeOut} from '../tasks/common/browser/config';
import {getTextByXPath} from './dom';

test('dom', async ()=>{
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
