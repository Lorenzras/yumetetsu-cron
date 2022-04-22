import {ScraperFn} from '../../types';

export const scrapeHOMES: ScraperFn = async (page, url) => {
  page.goto(url);
  console.log(url);

  return [{
    propertyType: '中古マンション',
    address: '',
    area: '',
    price: 2000,
    propertyName: '',
    propertyUrl: '',
  }];
};
