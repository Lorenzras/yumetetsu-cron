/* eslint-disable max-len */
import {Page} from 'puppeteer';
import retry from 'async-retry';
import {logger} from '../../../../utils';
import {selectByText} from './searchDoProperty';

export const setLocation = async (
  {page, data}:
  {
    page: Page,
    data: {
      pref: string,
      city: string,
      town: string,
    }
  }) => {
  const {pref, city, town} = data;
  await retry(async ()=>{
    logger.info(`Setting location. ${pref} ${city} ${town}`);
    await page.click('#modal_clear_button').catch(()=>null);

    /* Open modal */
    await page.waitForSelector('#select_button_city1');
    await page.click('#select_button_city1');

    // await selectByText(page, '#select_pref_id', '愛媛県' );
    await selectByText(page, '#select_pref_id', pref );

    await page.click('#modal_city_name_autocomplete_list_button');
    await page.type('#modal_city_name_autocomplete', city);


    /* Town field is disabled until triggering blur event on city field */
    await page.$eval(
      '#modal_city_name_autocomplete', (e) => {
        (e as HTMLInputElement).blur();
      });

    if (town) {
      await page.waitForSelector(
        '#modal_town_name_autocomplete:not(:disabled)',
        {timeout: 10000},
      )
        .then(async ()=>{
          // There are times when blur doesn't fire to populate autocomplete.
          // So click the button.
          await page.click('#modal_town_name_autocomplete_list_button');
          return page.type('#modal_town_name_autocomplete', town);
        })
        .catch((err: any)=>{
          throw new Error(`Failed to type town ${err.message}`);
        });
    }

    await page.click('#modal_ok_button');
    await page.waitForSelector('#select_pref_id', {hidden: true});
  }, {
    retries: 3,
    onRetry: async (e, tries) => {
      logger.error(`Failed. Retrying to populate location form. ${e.message} Attempt: ${tries}`);
    },
  });
};
