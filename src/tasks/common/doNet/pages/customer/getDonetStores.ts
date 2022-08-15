import {openBrowserPage} from '../../../browser';
import {login} from '../../login';
import {navigateToCustPage} from '../navigate';
import {getOptionsStore} from './content';

export const getDonetStores = async () => {
  const page = await openBrowserPage();
  await login(page);
  await navigateToCustPage(page);
  const stores = await getOptionsStore(page);

  await page.close();
  return stores;
//
};
