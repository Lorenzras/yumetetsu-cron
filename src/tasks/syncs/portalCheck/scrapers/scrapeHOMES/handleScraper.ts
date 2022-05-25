import {THandleScraper} from '../../types';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';
import {scrapeDtMansion} from './scrapeDtMansion';

export const handleScraper: THandleScraper = async (page, propType) => {
  console.log('propType:', propType);
  switch (propType) {
    case '中古戸建':
      return scrapeDtHouse(page);
    case '中古マンション':
      return scrapeDtMansion(page);
    case '土地':
      return scrapeDtLot(page);
    default: throw new Error('handleScraper: Please provide proptype.');
  }
};
