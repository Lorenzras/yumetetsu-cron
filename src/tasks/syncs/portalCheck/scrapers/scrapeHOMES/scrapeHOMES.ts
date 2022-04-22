import {cityLists as location} from '../../config';
import {ScraperFn} from '../../types';
import {perCity} from './perCity';

const homeURL = 'https://www.homes.co.jp/kodate/chuko/tokai/';


export const scrapeHOMES : ScraperFn = async (page) => {
  for (const [pref, cities] of Object.entries(location)) {
    console.log(cities);
    await page.goto(homeURL, {waitUntil: 'networkidle2'});
    await Promise.all([
      page.$x(`//a[contains(text(), "${pref}")]`)
        .then(([prefEl]) => prefEl.click()),
      page.waitForNavigation(),
    ]);

    await perCity(page, cities);
  }


  return [
    {
      propertyName: '',
      propertyType: '中古マンション',
      address: '',
      area: 1000,
      price: 90000,
      propertyUrl: '',
    },
  ];
};
