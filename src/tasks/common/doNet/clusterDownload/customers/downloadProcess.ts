
import {Page} from 'puppeteer';
import {logger} from '../../../../../utils/logger';
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
import {loginToCustomerPage} from '../../pages/customer/loginToCustomerPage';

/**
 * Central download process
 *
 * @param page
 * @param options
 * @returns {object} containing count, options used, and agents if applicable.
 */
export const downloadProcess = (
  page: Page,
  options: IFormOptions,
) => {
  const {
    storeId,
    agentId,
    workerId = 404,
    dir = downloadDir,
  } = options;
  return retry(async ()=>{
    const isWithCookie = await setBrowserCookie(page, workerId);
    logger.info(`processing: ${storeId} ${agentId}`);


    if (!isWithCookie || !await navigateToCustPage(page)) {
      logger.info('Logging in to customer page.');
      await loginToCustomerPage(page);
    }
    await saveBrowserCookie(page, workerId);


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
        downloadDir: dir,
        encoding: 'utf8',
        removeTimeFromDate: false,
        prefix: `${[storeId, agentId ?? '', count]
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
