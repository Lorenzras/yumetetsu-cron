import {browserTimeOut} from './config';
import {launchBrowser, getExtraPuppeteer} from './openBrowser';
import axios from 'axios';
import {load} from 'cheerio';

describe('Browser', () => {
  it('is opened.', async ()=> {
    const browser = await launchBrowser({slowMo: 0});
    await browser.close();
    expect(browser);
  }, browserTimeOut);

  it('proxy', async ()=>{
    const browser = await getExtraPuppeteer().launch({
      headless: false,
      args: [
        '--proxy-server=HTTP://164.155.150.0:80',
      ],
    });

    const page = await browser.newPage();

    await page.goto('https://whatismycountry.com');
    await page.waitForTimeout(10000);

    await browser.close();
  }, browserTimeOut);

  it('axios', async ()=>{
    const result = await axios.post('https://www.athome.co.jp/tochi/6976080753/').then((resp)=> resp.data);
    const $ = load(result);
    const companyName =$('.company-data_name a').text();
    const phone = $('th:contains(TEL/FAX) ~ td').text();

    expect(companyName).toMatchSnapshot();
    expect(phone).toMatchSnapshot();
  }, browserTimeOut);
});
