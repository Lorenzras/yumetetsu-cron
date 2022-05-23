
import {Page} from 'puppeteer';
import {logger} from '../../../../../../utils';
import {IProperty} from '../../../types';

import {produce} from 'immer';
import {getContactByLink} from './getContactByLink';


export const scrapeContacts = async (page: Page, data: IProperty[]) => {
  // const newPage = await page.browserContext().newPage();
  let nextState: IProperty[] = [...data];

  try {
    for (const [idx, val] of data.entries()) {
      const {掲載企業, 掲載企業TEL} = await getContactByLink(page, val.リンク);

      nextState = produce(nextState, (draft: IProperty[]) => {
        draft[idx].掲載企業 = 掲載企業;
        draft[idx].掲載企業TEL = 掲載企業TEL;
      });
    }
  } catch {
    logger.error('Failed to get contact.');
    return nextState;
  }

  return nextState;
};
