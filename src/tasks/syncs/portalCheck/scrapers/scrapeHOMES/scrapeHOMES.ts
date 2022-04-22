import {ScraperFn} from '../../types';

export const scrapeHOMES : ScraperFn = async (page, url) => {
  page.goto(url, {waitUntil: 'networkidle0'});

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
