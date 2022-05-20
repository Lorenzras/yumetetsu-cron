import {Page} from 'puppeteer';
import {logger} from '../../../../../../utils';
import {IProperty} from '../../../types';
import {scrapeSingleContact} from './scrapeSingleContact';
import {scrapeSingleContactLot} from './scrapeSingleContactLot';

export const scrapeContacts = async (page: Page, data: IProperty[]) => {
  const newPage = await page.browserContext().newPage();
  const result = [...data];

  try {
    for (const [idx, val] of data.entries()) {
      await page.goto(val.リンク);
      let isLotPage = false;

      await Promise.race([
        page.waitForSelector('p.attention a'),
        page.waitForNetworkIdle(),
      ]).catch(()=> isLotPage = true);

      const companyContact = isLotPage ?
        await scrapeSingleContactLot(newPage) :
        await scrapeSingleContact(newPage);
      result[idx] = {...result[idx], ...companyContact};
    }

    newPage.close();
  } catch {
    logger.info('Failed to get contact');
    return result;
  }

  console.log(result);
  return result;
};
