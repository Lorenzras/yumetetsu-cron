import {getAgents} from './getAgents';

import {IConcurrentData} from '../types';
import {Page} from 'puppeteer';

import {selectors} from '../selectors';
import {getStores} from './getStores';

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
    const inputs = $('th:contains(ステータス) ~ td input');
    const cleanStatused = propStatuses.filter(Boolean);
    if (cleanStatused.length === 0) {
      inputs.prop('checked', true );
    } else {
      inputs.each((_, el) => {
        $(el).prop(
          'checked',
          cleanStatused.includes($(el).val()?.toString() || ''));
      });
    }
  }, propStatuses);
};

const setDates = async ({page, fromDate}: {
  page: Page,
  fromDate: string
}) =>{
  await page.evaluate((fromDate = '')=>{
    $('#m_estate_filters_modify_datetime_from').val(fromDate);
  }, fromDate);
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
    store = '',
    agent,
    propType, status,
    fromDate = '',
  }: IConcurrentData,
) => {
  await page.waitForSelector(`${selectors.storeSelect} option`);
  await page.select(selectors.storeSelect, store);

  await setAgent(page, agent);

  await setPropertyTypes(page, propType);

  await setPropertyStatus(page, status);

  await setDates({page, fromDate});

  await Promise.all([
    page.waitForNavigation(),
    page.evaluate((btnSearchSel)=>{
      $(btnSearchSel).trigger('click');
    }, selectors.searchButton),
  ]);

  return {
    stores: await getStores({page}),
    agents: await getAgents({page}),
  };
};
