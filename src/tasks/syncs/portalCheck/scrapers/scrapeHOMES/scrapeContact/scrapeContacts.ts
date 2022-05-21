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
      let isLotPage = false;
      console.log(val.リンク, 'link');
      await newPage.goto(val.リンク);
      await Promise.race([
        newPage.waitForSelector('p.attention a'),
        newPage.waitForNetworkIdle(),
      ]).catch(()=> isLotPage = true);

      const companyContact = isLotPage ?
        await scrapeSingleContactLot(newPage) :
        await scrapeSingleContact(newPage);
      result[idx] = {...result[idx], ...companyContact};
    }

    await newPage.close();
  } catch {
    logger.info('Failed to get contact');
    return result;
  }

  console.log(result);
  return result;
};
