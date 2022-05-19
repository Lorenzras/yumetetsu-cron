import {Page} from 'puppeteer';
import {IHouse, IMansion} from '../../types';

export const scrapeDtApartment = async (
  page: Page,
  result?: IMansion[] | [],
) : Promise<IMansion[]> => {
  /*
    処理
  */
  return [{
    address: '仮',
    floorArea: '仮',
    layout: '仮',
    price: 0,
    propertyName: '仮',
    propertyUrl: '仮',
    rawPrice: '仮',
  }];
};
