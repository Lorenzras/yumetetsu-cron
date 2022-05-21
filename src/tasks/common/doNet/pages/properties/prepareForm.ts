
import {IConcurrentData} from './types';
import {Page} from 'puppeteer';

import {selectors} from './selectors';

/**
 * Sets agent
 * @param page Page
 * @param agent value of option, default is 「選択してください」
 */
const setAgent = async (page: Page, agent = '') => {
  await page.waitForSelector(`${selectors.agentsSelect} option`);
  await page.select(selectors.agentsSelect, agent);
};

/**
 * Set Property Types
 *
 * @param page Page
 * @param propTypes property type array
 */
const setPropertyTypes = async (page: Page, propTypes : string[] = [] ) =>{
  await page.evaluate((propTypes: string[])=>{
    const inputs = $('th:contains(物件種別) ~ td input');
    inputs.each((_, el) => {
      const jQEl = $(el);
      jQEl.prop('checked', propTypes.includes(jQEl.val()?.toString() || ''));
    });
  }, propTypes);
};

/**
 * Set Status
 *
 * @param page Page
 * @param propStatuses property type array
 */
const setPropertyStatus = async (page: Page, propStatuses : string[] = [] ) =>{
  await page.evaluate((propStatuses: string[])=>{
    $('th:contains(ステータス) ~ td input').prop('checked', false);
    for (const item of propStatuses) {
      console.log('item', item);
      $(`th:contains(ステータス) ~ td div div:contains(${item}) input`)
        .prop('checked', true);
    }
  }, propStatuses);
};


/**
 * Sets the form
 *
 * @param page Page
 * @param param1 Form settings
 */
export const prepareForm = async (
  page: Page,
  {
    store, agent,
    propType, status,
  }: IConcurrentData,
) => {
  // 店舗 select
  await page.waitForSelector(`${selectors.storeSelect} option`);

  await Promise.all([
    page.select(selectors.storeSelect, store),
    setAgent(page, agent),
    setPropertyTypes(page, propType),
    setPropertyStatus(page, status),
  ]);
  /*   await page.select(selectors.storeSelect, store);

  // 担当者 select
  await setAgent(page, agent);

  // 物件種別 checkboxes
  await setPropertyTypes(page, propType);

  // ステータス checkboxes
  await setPropertyStatus(page, status);
 */

  // Press search
  await Promise.all([
    page.waitForNavigation(),
    page.click(selectors.searchButton),
  ]);
};
