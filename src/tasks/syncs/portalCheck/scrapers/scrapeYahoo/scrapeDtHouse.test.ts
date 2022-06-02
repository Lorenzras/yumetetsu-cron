import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {scrapeDtHouse} from './scrapeDtHouse';

/* test site  https://realestate.yahoo.co.jp/used/house/search/05/23/?min_st=99&info_open=3&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf%5B%5D=23&geo%5B%5D=23201&geo%5B%5D=23207&geo%5B%5D=23214 */
/* https://realestate.yahoo.co.jp/used/house/search/05/23/?min_st=99&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf%5B%5D=23&geo%5B%5D=23201&geo%5B%5D=23207&geo%5B%5D=23210&geo%5B%5D=23213&geo%5B%5D=23227&geo%5B%5D=23214&geo%5B%5D=23211&geo%5B%5D=23209&geo%5B%5D=23212&geo%5B%5D=23236 */
test(('scrapeDtHouse'), async ()=>{
  const page = await openMockBrowserPage();
  const result = await scrapeDtHouse(page);

  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);
