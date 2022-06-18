import {
  openMockBrowserPage,
  openBrowserPage,
} from './../../../../../common/browser/openBrowser';
import {browserTimeOut} from './../../../../../common/browser/config';
import {getContactByLink, getContactByLinkFast} from './getContactByLink';


const testLinks = [
  'https://www.homes.co.jp/mansion/b-1093100000760/',
  'https://www.homes.co.jp/mansion/b-1436460000425/',
  'https://www.homes.co.jp/mansion/b-1453580001292/',

];

describe('getContactByLink', ()=>{
  test('normal', async ()=>{
    const page = await openBrowserPage();


    const results = [];

    for (const link of testLinks) {
      results.push(await getContactByLink(page, link ));
    }

    await page.close();
    expect(results).toMatchSnapshot();
  }, browserTimeOut);

  test('fast', async ()=> {
    const results = testLinks.map(async (item)=>{
      return await getContactByLinkFast(item);
    });

    expect(await Promise.all(results)).toMatchSnapshot();
  }, browserTimeOut);
});


