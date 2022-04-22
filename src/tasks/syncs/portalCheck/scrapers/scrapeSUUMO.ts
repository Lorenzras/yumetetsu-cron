import { ScraperFn } from '../types';

export const scrapeSUUMO: ScraperFn = (page, url) => {

  await page.goto('https://suumo.jp/ms/chuko/aichi/city/');
  await page.click('#sa02_sc201');

  await Promise.all([
    page.click('.js-searchBtn'),
    page.waitForNavigation(),
  ]);

  await Promise.all([
    page.click('.ui-icon--tabview'),
    page.waitForNavigation(),
  ]);


  const bukkenlists = await page.$$eval(
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

  await page.waitForTimeout(2000);

  return bukkenlists;
};

return [
  {

  },
];
};
