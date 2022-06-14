/* eslint-disable max-len */
import {browserTimeOut} from '../../../../../common/browser/config';
import {getDataEndpoint} from './getDataEndpoint';

// Search result URL
// https://realestate.yahoo.co.jp/land/search/05/23/?min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111

// params: min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111
// min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111&page=0

// Data endpoint
// https://realestate.yahoo.co.jp/land/search/partials/?bk=3&bk=6&min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111&page=0

test('getDataEndpoinnt', ()=>{
  const testUrls = [
    'https://realestate.yahoo.co.jp/used/house/search/05/23/?min_st=99&p_und_flg=0&group_with_cond=0&sort=-buy_default+p_from+-area&lc=05&pf%5B%5D=23&geo%5B%5D=23110&geo%5B%5D=23113&geo%5B%5D=23201&geo%5B%5D=23204',
    'https://realestate.yahoo.co.jp/land/search/05/23/?min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111',
  ];

  const result = testUrls.map((s) => getDataEndpoint(s));
  // const result = getDataEndpoint('https://realestate.yahoo.co.jp/land/search/05/23/?min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111');

  expect(result).toMatchSnapshot();
}, browserTimeOut);
