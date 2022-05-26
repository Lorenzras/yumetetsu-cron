import {handlePrepareForm} from './handlePrepareForm';
import {openBrowserPage, openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtHouse} from './scrapeDtHouse';

// https://www.athome.co.jp/kodate/chuko/aichi/komaki-city/list/

describe('House', () => {
  it('all', async () => {
    const page = await openBrowserPage();
    await handlePrepareForm(page, '愛知県', '中古戸建');
    const result = await scrapeDtHouse(page);
    console.log(result.length);
    // page.browser().disconnect();
    await page.close();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
} );
