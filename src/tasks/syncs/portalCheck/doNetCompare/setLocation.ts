/* eslint-disable max-len */
import {Page} from 'puppeteer';
import retry from 'async-retry';
import {logger} from '../../../../utils';
import {selectByText} from './searchDoProperty';

export const setLocation = async (
  {page, data, logSuffix}:
  {
    page: Page,
    data: {
      pref: string,
      city: string,
      town: string,
    },
    logSuffix: string

  }) => {
  const {pref, city, town} = data;
  await retry(async ()=>{
    // Test reset in case of retrying
    // await page.click('#modal_clear_button').catch(()=>true);

    logger.info(`${logSuffix} is opening location modal.`);

    /* Open modal */
    await page.waitForSelector('#select_button_city1');
    await page.click('#select_button_city1'),


    logger.info(`${logSuffix} is setting prefecture.`);
    await Promise.all([
      selectByText(page, '#select_pref_id', pref ),
      page.waitForResponse((resp) => {
        return resp.url().includes('https://manage.do-network.com/m_city/list') &&
        resp.status() === 200;
      }, {timeout: 10000}).catch(),
    ]);

    logger.info(`${logSuffix} is setting city`);
    await page.click('#modal_city_name_autocomplete', {clickCount: 3});
    await page.type('#modal_city_name_autocomplete', city);

    if (town) {
      // On slow or laggy computers, donet's town API takes a very long time to respond so
      // I addressing it with the following lines

      logger.info(`${logSuffix} is waiting for town list reponse. `);
      await Promise.all([
        page.$eval(
          '#modal_city_name_autocomplete', (e) => {
            (e as HTMLInputElement).blur();
          }),
        page.waitForResponse((resp) => {
          return resp.url().includes('https://manage.do-network.com/m_town/list') &&
           resp.status() === 200;
        }).catch(()=>true),
      ]);

      // Click/Focus to trigger populate when trigger blur event failed due to network lag.
      await page.click('#modal_town_name_autocomplete');

      await page.waitForSelector(
        '#modal_town_name_autocomplete:not(:disabled)',
        {timeout: 5000},
      )
        .then(async ()=>{
          // Setting the value directly does not reliably trigger autocomplete so
          // 3x click the field to simulate a person overwriting town field.
          logger.info(`${logSuffix} is typing town`);
          await page.click('#modal_town_name_autocomplete', {clickCount: 3});
          return page.type('#modal_town_name_autocomplete', town);
        })
        .catch(async (err: any)=>{
          await page.click('#modal_clear_button', {delay: 1000}).catch(()=>true);
          await page.waitForSelector('#modal_clear_button', {hidden: true});
          throw new Error(`${logSuffix} failed to type town, clicking clear. ${err.message}`);
        });
    }

    await page.click('#modal_ok_button');
    await page.waitForSelector('#select_pref_id', {hidden: true});
  }, {
    retries: 5,
    onRetry: async (e, tries) => {
      logger.warn(`${logSuffix} retried ${tries} time/s in retrying to populate location form. ${e.message}`);
    },
  });
};
