import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {prepareForm, searchYahoo} from './prepareForm';

/* https://suumo.jp/ms/chuko/aichi/city/ */

describe('prepareForm', () => {
  test(('prepareForm'), async () => {
    const page = await openMockBrowserPage();
    await prepareForm(page, '愛知県', '中古マンション');

    page.browser().disconnect();
  }, browserTimeOut);


  /* test comand:: jest scrapeYahoo/prepareForm -t click -u */
  test(('click'), async () => {
    const page = await openMockBrowserPage();
    await searchYahoo(page);

    page.browser().disconnect();
  }, browserTimeOut);
});
