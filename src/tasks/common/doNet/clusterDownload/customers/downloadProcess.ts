
import {Page} from 'puppeteer';
import {logger} from '../../../../../utils/logger';
import {login} from '../../login';
import {clickSearch} from '../../pages/customer/clickSearch';
import {
  setCustomerForm,
} from '../../pages/customer/setCustomerForm';
import {navigateToCustPage} from '../../pages/navigate';
import retry from 'async-retry';
import {
  saveBrowserCookie,
  setBrowserCookie,
} from '../../../browser/helpers/cookies';
import {handleDownload} from '../../helpers/handleDownload';
import {APP_IDS} from '../../../../../api/kintone';
import {dlLimit, downloadDir} from './config';
import {getOptionsEmployee} from '../../pages/customer';


export const downloadProcess = (
  page: Page,
  options: IFormOptions,
) => {
  const {
    storeId,
    agentId,
    workerId = 404,
  } = options;
  return retry(async ()=>{
    const isWithCookie = await setBrowserCookie(page, workerId);
    logger.info(`processing: ${storeId} ${agentId}`);

    if (!isWithCookie) {
      await login(page);
      await navigateToCustPage(page);
      await saveBrowserCookie(page, workerId);
    } else {
      await page.goto('https://manage.do-network.com/customer');
    }


    await setCustomerForm(page, options);
    let agents: AsyncReturnType<typeof getOptionsEmployee> = [];


    if (!agentId) {
      // if no agentid specified, retrieve employees list
      agents = await getOptionsEmployee(page);
    }
    const count = await clickSearch(page);

    // Donet has a 4000 limit.
    if (count > 0 && count <= dlLimit ) {
      await handleDownload({
        page,
        requestURL: 'https://manage.do-network.com/customer/ListCsvDownload',
        appId: APP_IDS.customers,
        downloadDir: downloadDir,
        prefix: `${[storeId, agentId, count]
          .filter((i) => i != undefined)
          .join('-')}`,
      });
      return {
        count,
        options,
      };
    } else {
      return {
        count,
        options,
        agents,
      };
    }
  }, {
    onRetry: (e, attempt) => {
      logger.warn(`Error ${e.message} with ${attempt} attemp/s.`);
    },
    retries: 2,
  });
};
