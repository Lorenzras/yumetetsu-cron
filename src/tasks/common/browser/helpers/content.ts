
import {logger} from '../../../../utils';
import {Page} from 'puppeteer';

export const getSelectOptions = async (page : Page, selector: string) => {
  logger.info(`Retrieving options of ${selector}`);
  // await page.waitForNetworkIdle();
  await page.waitForSelector(selector);

  const allOptions = await page.$$eval(
    selector + ' > option', (options) => {
      return (options as unknown as HTMLOptionElement[]).map(
        (option) => ({value: option.value, text: option.textContent ?? ''}),
      );
    },
  );

  return allOptions
    .filter(({text}) => {
      return text?.length; // && !text?.includes('選択');
    });
};
