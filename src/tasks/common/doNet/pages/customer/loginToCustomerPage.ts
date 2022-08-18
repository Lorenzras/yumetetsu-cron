import {Page} from 'puppeteer';
import {homeSelectors} from '../../config';
import {login} from '../../login';
import {navigateToCustPage} from '../navigate';

export const loginToCustomerPage = async (page: Page) => {
  await login(page);
  await navigateToCustPage(page);
};
