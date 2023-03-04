import {logger, select} from '../../../../utils';
import {Page, ElementHandle} from 'puppeteer';
import {getOptValByText} from './getOptValByText';

export const selectByText = async (
  parentEl: Page | ElementHandle<Element>,
  selector: string,
  text: string,
) => {
  // await page.waitForTimeout(2000);
  logger.info(`${selector} appeared.`);
  const value = await getOptValByText(parentEl, text);

  await parentEl.select(selector, value);
  logger.info(`Selected  ${value} at ${selector}.`);
};
