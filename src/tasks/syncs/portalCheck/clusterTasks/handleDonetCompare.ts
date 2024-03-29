/* eslint-disable max-len */
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {IProperty} from '../types';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {cookiesPath, getFileName, logger, saveJSON} from '../../../../utils';
import fs from 'fs';
import path from 'path';
import {kintoneAppId, resultJSONPath} from '../config';


export const cookieFile = (workerId: number) => {
  return path.join(cookiesPath, `donet-${workerId}.json`);
};

export const saveCookie = async (page: Page, workerId: number) => {
  logger.info(`Worker ${workerId} is saving cookie.`);
  try {
    const workerCookie = await page.cookies();
    const cookiePath = cookieFile(workerId);
    fs.writeFileSync(cookiePath, JSON.stringify(workerCookie));
    logger.info(`Worker ${workerId} successfully saved cookie.`);
  } catch (err: any) {
    logger.error(`I was not able to save the cookie. ${err.message}`);
  }
};

export const setCookie = async (page: Page, workerId: number) => {
  logger.info(`Worker ${workerId} is setting cookie to page.`);

  try {
    const cookiePath = cookieFile(workerId);
    const cookiesString = fs.readFileSync(cookiePath, 'utf8');

    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    await page.goto('https://manage.do-network.com/estate');
    // await page.waitForSelector('#m_estate_filters_fc_shop_id option');
    logger.info(`Worker ${workerId} is successfully set cookie.`);
  } catch (err) {
    logger.warn('I was not able to load the cookie.');
  }
};

// eslint-disable-next-line valid-jsdoc
/**
 * Split properties into chunks then compare each item to donet.
 * This was designed to reuse the browser for each chunk.
 *
 * However, Chrome's memory leak kicks in when the browser is open for
 * a long time, so I reverted back to 1 task/thread and just
 * have dedicated cookie file for each worker.
 *
 * I'll refactor this again.
 *
 * @param cluster Cluster object
 * @param dtArr unprocessed IProperty[]
 * @param processAll process regardless if already done
 * @returns {IProperty[]} Processed properties.
 */
export const handleDonetCompare = async (
  cluster: Cluster<{page: Page}>,
  dtArr: IProperty[],
  processAll = false,
) => {
  const dtArrLength = dtArr.length;

  const newDtArr = await Promise.all(dtArr.map(async (prop, idx) => {
    try {
      // For retries, if already processed, ignore.
      if (!processAll && prop.DO管理有無?.trim()) return prop;

      // Actual process
      return await cluster.execute(async ({page, worker}) => {
        const logSuffix = `Worker ${worker.id} at task ${idx + 1} of ${dtArrLength} `;
        await setCookie(page, worker.id);

        const doNetComparedResults = await searchDoProperty(
          {
            page,
            inputData: prop,
            logSuffix,
          },
        );

        await saveCookie(page, worker.id);

        const firstComparedResult = doNetComparedResults[0];

        return {
          ...prop,
          ...firstComparedResult,
        };
      }) as IProperty;
    } catch (err: any) {
      logger.error(`Unhandled error at clusterTasks.handleDonetCompare ${JSON.stringify(prop)} ${err.message} `);
      return prop;
    }
  }));


  await saveJSON(getFileName({
    appId: kintoneAppId,
    dir: resultJSONPath,
    suffix: '-doComparedDt-' + newDtArr.length.toString(),
  }), newDtArr);
  logger.info(`Done comparing to donet.`);
  return newDtArr;
};
