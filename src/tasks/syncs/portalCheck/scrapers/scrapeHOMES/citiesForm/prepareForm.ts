import {Page} from 'puppeteer';
import {selectTargetCities} from './selectTargetCities';

export const prepareForm = async (
  page: Page,
  cities: string[],
) => {
  /* ステップ１ */
  await selectTargetCities(page, cities);
};
