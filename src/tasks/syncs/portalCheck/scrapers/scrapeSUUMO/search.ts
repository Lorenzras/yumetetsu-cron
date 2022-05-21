import {Page} from 'puppeteer';
import {prepareForm} from './prepareForm';
import {searchClick} from './searchClick';

export const search = async (page:Page, cities:string[]) => {
  await prepareForm(page, cities);
  await searchClick(page);
};
