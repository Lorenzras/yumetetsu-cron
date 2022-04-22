import {openBrowserPage, openMockBrowserPage} from '../../common/browser';

const DEBUG_MODE = true;

export const main = async () => {
  let firstPage;
  if (DEBUG_MODE) {
    firstPage = await openMockBrowserPage();
  } else {
    firstPage = await openBrowserPage();
    await firstPage.goto('https://suumo.jp/ms/chuko/aichi/city/');
    await firstPage.click('#sa02_sc201');

    await Promise.all([
      firstPage.click('.js-searchBtn'),
      firstPage.waitForNavigation(),
    ]);

    await Promise.all([
      firstPage.click('.ui-icon--tabview'),
      firstPage.waitForNavigation(),
    ]);
  }

  const bukkenlists = await firstPage.$$eval(
    '.property_unit.property_unit--osusume2',
    (el: any) => el.map((data: any) => {
      console.log('data', data);
      console.log(data.getElementsByClassName('property_unit-title_wide')[0]
        .getElementsByTagName('a')[0].href);

      return {
        bukkenmei: data
          .getElementsByClassName('property_unit-title_wide')[0].innerText,
        kakaku: data.getElementsByClassName('dottable-value--2')[0].innerText,
        shozaichi: data.getElementsByTagName('dd')[2].innerText,
        menseki: data.getElementsByTagName('dd')[1].innerText,
        URL: data.getElementsByClassName('property_unit-title_wide')[0]
          .getElementsByTagName('a')[0].href,
      };
    }));


  console.log(bukkenlists.length);

  await firstPage.waitForTimeout(2000);

  if (DEBUG_MODE) {
    await firstPage.browser().disconnect();
  } else {
    await firstPage.browser().close();
  }

  return bukkenlists;
};
