import {Page} from 'puppeteer';
import {IHouse} from '../../types';

export const scrapeDtHouse = async (
  page: Page,
  result?: IHouse[] | [],
) : Promise<IHouse[]> => {
  /*
    処理
  */
  return [{
    address: '仮',
    buildingArea: '仮',
    lotArea: '仮',
    price: '仮',
    propertyName: '仮',
    propertyUrl: '仮',
  }];
};
