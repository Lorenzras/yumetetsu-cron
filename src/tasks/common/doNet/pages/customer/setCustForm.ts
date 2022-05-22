
import {Page} from 'puppeteer';
import {logger} from '../../../../../utils';
import selectors from './selectors';

interface Options {
  chkStatus : boolean,
  dateStr?: string
}

export const setCustForm = async (
  page: Page,
  options: Options = {chkStatus: false}) => {
  const isChecked = options.chkStatus;

  logger.info('Setting up form.' + isChecked);


  await page.waitForSelector(
    selectors.btnExpandForm, {visible: true});


  if (options.dateStr) {
    await page.click(selectors.btnExpandForm);
    await page.waitForSelector(
      selectors.updateDate, {visible: true});
    await page.type(
      selectors.updateDate, options.dateStr,
    );
  }
  await page.$$eval(
    selectors.chkStatuses,
    (checks, isChecked) => {
      checks.forEach((c) => {
        (c as HTMLInputElement)
          .checked = isChecked as boolean;
      });
    }, isChecked);
};
