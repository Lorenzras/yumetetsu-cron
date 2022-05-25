import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {IHouse, ILot} from '../../types';
import {webScraper} from '../helpers/webScraper';

export const scrapeDtLotPage = async (page: Page) => {
  logger.info('Scraping atHOME dtLot page.');
  return await page.$$eval('div[data-category="物件"]', (els) => {
    console.log(`Found ${els.length} in this page.`);
    return els.map<ILot>((el)=>{
      const titleEl = $(el).find('p.heading a');
      const propName = titleEl
        .html().split('<span', 1)[0].trim();
      const url = titleEl.prop('href');
      const rawLotArea = $(el)
        .find('th:contains(土地面積) ~ td').text().trim().replace(/\s\s+/g, ' ');
      return {
        物件名: propName,
        リンク: url,
        土地面積: rawLotArea,
        所在地: $(el).find('th:contains(所在地) ~ td').text().trim(),
        比較用価格: 0,
        比較用土地面積: 0,
        販売価格: $(el).find('th:contains(価格) ~ td').text().trim(),
      };
    });
  });
};

export const handleNextPage = async (page: Page) => {
  const nextPageBtn = (await page.$x('//a[contains(text(), "次へ")]'))?.[0];
  if (nextPageBtn) {
    logger.info('Clicking next page.');
    await Promise.all([
      page.waitForNavigation(),
      nextPageBtn.click(),
    ]);
    return true;
  }
  return false;
};

export const scrapeDtLot = async (
  page: Page,

) => {
  return await webScraper<ILot>({
    page,
    handleScraper: scrapeDtLotPage,
    handleNextPage: handleNextPage,
  });
};
