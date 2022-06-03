import {produce} from 'immer';
import {Page} from 'puppeteer';
import {extractNumber, extractPrice, logger} from '../../../../../utils';
import {IHouse, ILot, IMansion, IProperty} from '../../types';
import {logErrorScreenshot} from './logErrorScreenshot';

export const webScraper = async <
  T extends IProperty | IHouse | ILot | IMansion
>(
  params:
  {
    page: Page,
    handleScraper: (page: Page) => Promise<T[]>,
    handleNextPage: (page: Page) => Promise<boolean>
    result?: T[]
  },
): Promise<T[]> => {
  const {
    page,
    handleNextPage,
    handleScraper,
    result = [],
  } = params;

  try {
    logger.info('Generic scraper started.');
    const data = await handleScraper(page);

    logger.info(`Scraped ${data.length} items from this page ${page.url()}.`);
    const populateNumbers = data
      .map<T>((item)=> {
      return produce(item, (draftState) => {
        draftState.比較用価格 = extractPrice(draftState.販売価格);
        if ('比較用土地面積' in draftState ) {
          console.log('tochi', draftState.土地面積, extractNumber(draftState.土地面積));
          draftState.比較用土地面積 = extractNumber(draftState.土地面積);
        }
        if ('比較用専有面積' in draftState ) {
          draftState.比較用専有面積 = extractNumber(draftState.専有面積);
        }
      });
    });


    const cummulative = [...result, ...populateNumbers];
    if (await handleNextPage(page)) {
      return await webScraper({...params, result: cummulative});
    }

    logger.info(`Scraped a total of ${cummulative.length} from ${page.url()}`);
    return cummulative;
  } catch (err: any) {
    await logErrorScreenshot(
      page, `Generic web scraper failed at ${page.url()}`,
    );
    return [];
  }
};

