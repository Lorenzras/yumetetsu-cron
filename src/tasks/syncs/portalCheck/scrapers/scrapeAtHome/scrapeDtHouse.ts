import {Page} from 'puppeteer';
import {extractNumber, extractPrice, logger} from '../../../../../utils';
import {IHouse} from '../../types';

export const scrapeDtHousePage = async (page: Page) => {
  return await page.$$eval('div[data-category="物件"', (els) => {
    return els.map<IHouse>((el)=>{
      const titleEl = $(el).find('.object-title_name a');
      const propName = titleEl
        .html().split('<span', 1)[0].trim();
      const url = titleEl.prop('href');
      return {
        物件名: propName,
        リンク: url,
        土地面積: $(el).find('th:contains(土地面積) ~ td').text().trim(),
        所在地: $(el).find('th:contains(所在地) ~ td').text().trim(),
        比較用価格: 0,
        比較用土地面積: 0,
        販売価格: $(el).find('th:contains(価格) ~ td').text().trim(),
      };
    });
  });
};

export const scrapeDtHouse = async (
  page: Page,
  result?: IHouse[] | []) => {
  logger.info(`Scraping kodate. `);

  const data = await scrapeDtHousePage(page);

  const populateNumbers = data
    .map<IHouse>(((item)=>({
    ...item,
    比較用価格: extractPrice(item.販売価格),
    比較用土地面積: extractNumber(item.土地面積),
  })));

  return populateNumbers;
};
