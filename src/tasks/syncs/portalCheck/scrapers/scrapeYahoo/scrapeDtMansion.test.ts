import {
  openMockBrowserPage, openBrowserPage,
} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {getDataEndpoint} from './helpers/getDataEndpoint';
import {scrapeDtLot, scrapeDtLotPage} from './scrapeDtLot';
import {scrapeDtMansion, scrapeDtMansionPage} from './scrapeDtMansion';
// import axios from 'axios';

// https://realestate.yahoo.co.jp/used/mansion/search/05/23/?min_st=99&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf%5B%5D=23&geo%5B%5D=23201&geo%5B%5D=23207&geo%5B%5D=23211&geo%5B%5D=23214&geo%5B%5D=23219&geo%5B%5D=23101&geo%5B%5D=23109


describe('scrapeDtMansion', ()=>{
  it('single', async ()=>{
    // https://realestate.yahoo.co.jp/used/mansion/search/partials/?bk=4&min_st=99&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23201&geo=23207&geo=23211&geo=23214&geo=23219&geo=23101&geo=23109&page=0
    // Mock start
    const page = await openMockBrowserPage();
    // await page.goto(testURL);
    // const endpoint = getDataEndpoint(page.url());
    // await page.goto(endpoint);
    // Mock end

    const result = await scrapeDtMansionPage(page);

    console.log(result.length);
    expect(result).toMatchSnapshot();

    page.browser().disconnect();
  }, browserTimeOut);

  it('all', async ()=>{
    // https://realestate.yahoo.co.jp/used/mansion/search/05/23/?min_st=99&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf%5B%5D=23&geo%5B%5D=23104
    // https://realestate.yahoo.co.jp/used/mansion/search/?bk=4&min_st=99&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23201&geo=23207&geo=23211&geo=23214&geo=23219&geo=23101&geo=23109&page=1
    // Mock start
    const testURL = 'https://realestate.yahoo.co.jp/used/mansion/search/05/23/?min_st=99&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf%5B%5D=23&geo%5B%5D=23104';
    const page = await openBrowserPage();
    await page.goto(testURL);
    // Mock end

    const result = await scrapeDtMansion(page);

    console.log(`Fetched ${result.length} items`);
    expect(result).toMatchSnapshot();

    // page.browser().disconnect();
    await page.browser().close();
  }, browserTimeOut);
});
