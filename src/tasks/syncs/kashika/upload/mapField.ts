/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {cleanStoreName} from './cleanStoreName';

/**
 * マッピング設定
 *
 * @param param
 * @param param.page
 * @param param.csvField The csvField
 * @param param.kasikaField Array of strings that will match option. Used for retrieving value
 *
 */
export const mapField = async ({
  page, csvField, store,
} :
{
  page: Page,
  csvField: '顧客種別' | '顧客ステータス',
  store: string
}) => {
  await page.waitForSelector(`input[value="${csvField}"]`);


  const cleanStore = cleanStoreName(store);

  await page.evaluate((
    csvField: string,
    cleanStore: string,
  )=>{
    const selectEl = $(`input[value="${csvField}"]`)
      .closest('td')
      .find('.jsSelectRow select:first');

    const optValue = selectEl
      .find('option')
      .filter((_, el) => {
        return [cleanStore, csvField]
          .every((str) => $(el).text().includes(str));
      })
      .attr('value');

    if (!optValue) throw new Error(`Failed to find option ${[csvField, cleanStore].join(',')}`);
    selectEl.val(optValue);
  }, csvField, cleanStore);
};
