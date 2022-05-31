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
  const result = getDataEndpoint('https://realestate.yahoo.co.jp/land/search/05/23/?min_st=99&group_with_cond=1&sort=-buy_default+p_from+-area&lc=05&pf=23&geo=23101&geo=23102&geo=23104&geo=23105&geo=23107&geo=23108&geo=23110&geo=23113&geo=23116&geo=23111');

  expect(result).toMatchSnapshot();
}, browserTimeOut);
