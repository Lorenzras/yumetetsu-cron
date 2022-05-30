import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {prepareForm} from './prepareForm';

/* https://suumo.jp/ms/chuko/aichi/city/ */

// describe('prepareForm', () => {
/* test comand:: jest scrapeYahoo/prepareForm -t check -u */
test(('test1'), async () => {
  const page = await openMockBrowserPage();
  await prepareForm(page, '愛知県', '中古マンション', 1);

  page.browser().disconnect();
}, browserTimeOut);

/* test comand:: jest scrapeYahoo/prepareForm -t click -u */
/* test(('click'), async () => {
    const page = await openMockBrowserPage();
    await searchYahoo(page);

    page.browser().disconnect();
  }, browserTimeOut);

  test(('check'), async () => {
    const page = await openMockBrowserPage();
    await checkCities(page);

    page.browser().disconnect();
  }, browserTimeOut); */
// });
