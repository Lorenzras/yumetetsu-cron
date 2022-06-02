import {
  openMockBrowserPage, openBrowserPage,
} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {getDataEndpoint} from './helpers/getDataEndpoint';
import {scrapeDtLot, scrapeDtLotPage} from './scrapeDtLot';
// import axios from 'axios';

// https://realestate.yahoo.co.jp/land/search/05/23/?min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111

const testURL = 'https://realestate.yahoo.co.jp/land/search/05/23/?min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111';


describe('scrapeDtLot', ()=>{
  it('single', async ()=>{
    // Mock start
    const page = await openMockBrowserPage();
    // await page.goto(testURL);
    // const endpoint = getDataEndpoint(page.url());
    // await page.goto(endpoint);
    // Mock end

    const result = await scrapeDtLotPage(page);

    expect(result).toMatchSnapshot();

    page.browser().disconnect();
  }, browserTimeOut);

  it('all', async ()=>{
    // Mock start
    const page = await openBrowserPage();
    await page.goto(testURL);
    // Mock end

    const result = await scrapeDtLot(page);

    console.log(`Fetched ${result.length} items`);
    expect(result).toMatchSnapshot();

    // page.browser().disconnect();
    await page.browser().close();
  }, browserTimeOut);
});
