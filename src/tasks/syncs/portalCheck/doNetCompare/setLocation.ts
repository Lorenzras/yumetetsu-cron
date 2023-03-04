/* eslint-disable max-len */
import {Page} from 'puppeteer';
import retry from 'async-retry';
import {logger} from '../../../../utils';
import {selectByText} from './selectByText';
import {navigateToPropertyPage} from '../../../common/doNet/pages/navigate';

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
    await page.click('#modal_clear_button').catch(()=>true);

    logger.info(`${logSuffix} is opening location modal.`);


    /* Open modal */
    await retry(async () => {
      await page.waitForSelector('#select_button_city1', {visible: false});
    },
    {
      retries: 3,
      onRetry: async (e, tries) => {
        logger.warn(`${logSuffix} retried ${tries} time/s in retrying to open modal. ${e.message}`);
        await navigateToPropertyPage(page);
      },
    });

    await page.click('#select_button_city1'),

    logger.info(`${logSuffix} is setting prefecture.`);
    await page.waitForSelector('#simplemodal-data select');
    await selectByText(page, `#simplemodal-data select`, pref ),
    await page.waitForNetworkIdle({idleTime: 500}),

    logger.info(`${logSuffix} is setting city`);
    // click option with text containing name
    const [option] = await page.$x(`//th[contains(text(), "市区")]/following-sibling::td/select/option[contains(text(), "${city}")]`);
    await option.click(); // Town fetching will not trigger unless a city is clicked. So click here.

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
        }).catch(()=>logger.warn(`${logSuffix} failed to retrieve m_town.`)),
      ]);

      // Click/Focus to trigger populate when trigger blur event failed due to network lag.
      await page.click('#modal_town_name_autocomplete');

      await page.waitForSelector(
        '#modal_town_name_autocomplete:not(:disabled)',
        {timeout: 10000},
      )
        .then(async ()=>{
          // Setting the value directly does not reliably trigger autocomplete so
          // 3x click the field to simulate a person overwriting town field.
          logger.info(`${logSuffix} is typing town`);
          await page.click('#modal_town_name_autocomplete', {clickCount: 3});
          await page.type('#modal_town_name_autocomplete', town);
          logger.info(`${logSuffix} succesfully typed town.`);
        })
        .catch(async (err: any)=>{
          throw new Error(`${logSuffix} failed to type town, clicking clear. ${err.message}`);
        });
    }

    await page.click('#modal_ok_button');
    await page.waitForSelector('#select_pref_id', {hidden: true, timeout: 10000})
      .catch(()=>{
        throw new Error(`${logSuffix} Failed to click ok.`);
      });
  }, {
    retries: 3,
    onRetry: async (e, tries) => {
      logger.warn(`${logSuffix} retried ${tries} time/s in retrying to populate location form. ${e.message}`);
    },
    maxTimeout: 1000,
    minTimeout: 500,
  });
};
