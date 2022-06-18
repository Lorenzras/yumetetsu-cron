import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import {IHouse} from '../../types';
import {webScraper} from '../../helpers/webScraper';

export const scrapeDtHousePage = async (page: Page) => {
  logger.info('Scraping atHOME dtHouse page.');
  return await page.$$eval('div[data-category="物件"]', (els) => {
    console.log(`Found ${els.length} in this page.`);
    const pref = $('li:contains(検索結果)').parent()
      .find('li:contains(県) span').text();
    return els.map<IHouse>((el)=>{
      const titleEl = $(el).find('a.kslisttitle');
      const propName = titleEl
        .html().split('<span', 1)[0].trim();
      const url = titleEl.prop('href').split('?DOWN', 1)[0];
      const propId = url.split('/').at(-2);

      return {
        物件番号: `athome-${propId}`,
        物件名: propName,
        リンク: url,
        土地面積: $(el).find('th:contains(土地面積) ~ td').text().trim(),
        所在地: pref + $(el).find('th:contains(所在地) ~ td').text().trim(),
        比較用価格: 0,
        比較用土地面積: 0,
        販売価格: $(el).find('th:contains(価格) ~ td').text().trim(),
      };
    });
  });
};

const handleNextPage = async (page: Page) => {
  const nextPageBtn = (await page.$x('//a[contains(text(), "次へ")]'))?.[0];
  if (nextPageBtn) {
    logger.info('Clicking next page.');

    await Promise.allSettled([
      nextPageBtn.click(),
      page.waitForSelector('#loading', {visible: true, timeout: 1500}),
    ]);

    await page.waitForSelector('#loading', {hidden: true});

    logger.info('Succesfully clicked next page.');

    return true;
  }
  return false;
};

export const scrapeDtHouse = async (
  page: Page,

): Promise<IHouse[]> => {
  logger.info(`Scraping kodate. `);


  return await webScraper<IHouse>({
    page,
    handleScraper: scrapeDtHousePage,
    handleNextPage: handleNextPage,
  });
};
