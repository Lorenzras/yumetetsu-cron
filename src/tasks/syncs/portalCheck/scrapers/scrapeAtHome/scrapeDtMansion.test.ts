import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {handlePrepareForm} from './handlePrepareForm';
import {scrapeDtMansion, scrapeDtMansionPage} from './scrapeDtMansion';


// https://www.athome.co.jp/mansion/chuko/aichi/list/

describe('House', () => {
  it('all', async () => {
    const page = await openMockBrowserPage();
    await handlePrepareForm(page, '岐阜県', '中古マンション');
    const result = await scrapeDtMansion(page);
    expect(result).toMatchSnapshot();
    console.log(result.length);
    page.browser().disconnect();
  }, browserTimeOut);

  it('page', async () => {
    const page = await openMockBrowserPage();
    const result = await scrapeDtMansionPage(page);
    expect(result).toMatchSnapshot();
    console.log(result.length);
    page.browser().disconnect();
  }, browserTimeOut);
} );
