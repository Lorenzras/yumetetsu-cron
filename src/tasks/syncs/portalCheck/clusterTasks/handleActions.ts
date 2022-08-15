import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {IAction, IActionResult, IProperty} from '../types';
import {logger} from '../../../../utils';
import {handleAddPropertyType} from './handleAddPropertyType';
import {saveScrapeMeta} from '../helpers/saveScrapeMeta';

export const handleAction = async (
  cluster: Cluster<{page: Page}>,
  action: IAction,
): Promise<IActionResult> => {
  const {
    site, pref, type, handleScraper, handlePrepareForm,
  } = action;
  const res: IProperty[] = [];
  try {
    const initialResult : IProperty[] = await cluster
      .execute(async ({page}) => {
        let isIterate = true;
        let idx = 0;
        do {
          const formState = await handlePrepareForm(page, pref, type, idx);

          if (
            (typeof formState === 'boolean' && formState) ||
              (typeof formState !== 'boolean' && formState.success)
          ) {
            res.push(...await handleScraper(page));
          }

          if (typeof formState !== 'boolean' ) {
            isIterate = formState.nextIdx < formState.chunkLength;
            idx = formState.nextIdx;
          } else {
            isIterate = false;
          }
        } while (isIterate);

        logger.info(`Scraped total of ${res.length} from ${page.url()}`);
        return res;
      });

    const dataWithType = handleAddPropertyType(action, initialResult);

    return {
      site,
      prefecture: action.pref,
      propertyType: action.type,
      isSuccess: true,
      length: dataWithType.length,
      result: dataWithType,
    };
  } catch (err: any) {
    logger
      .error(
        `Unhandled error at scraperTask.handleAction ${[
          site, pref, type, err.message,
        ].join(' ')} `);
    return {
      site: action.site,
      prefecture: action.pref,
      propertyType: action.type,
      isSuccess: false,
      error: err.message,
    };
  }
};

export const handleActions = async (
  cluster: Cluster<{page: Page}>,
  shuffledActions: IAction[],
  saveToNetWorkDrive = true,
) => {
  const actionResults = (await Promise.all(
    shuffledActions.map(async (action) => {
      return await handleAction(cluster, action);
    }),
  ));

  saveScrapeMeta(actionResults, saveToNetWorkDrive);

  const scrapedProps = actionResults.reduce((accu, curr) => {
    if (curr.result?.length) {
      accu.push(...curr.result);
    }
    return accu;
  }, [] as IProperty[]);

  logger.info(
    `Scraped results ${scrapedProps.length}. Starting to compare to doNet.`);

  return scrapedProps;
};
