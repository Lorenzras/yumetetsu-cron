import {getDateYesterday} from './../../../../../../utils/dates';
/* eslint-disable max-len */
import {downloadLimit} from './../../../config';
import {logger} from './../../../../../../utils/logger';
import {IPropForm} from './../downloadTask';
import {IConcurrentData, TPropTypes, TPropStatusText} from './../types';
import {Cluster} from 'puppeteer-cluster';

/**
 * DoNet has 4000 limit so we need to limit the filter should this exeed.
 * For now, I will filter by the following.
 * - Search by store,
 * - Search by type,
 * - Search by status,
 * - search by agent
*/


export const downloadPerStore = async (
  cluster: Cluster<IConcurrentData>,
  isFullSync = false,
) => {
  const initialForm : IConcurrentData = {
    store: '',
    fromDate: isFullSync ? getDateYesterday() : undefined,
  };

  // const stores: string[] = await cluster.execute(getStores);

  const handleDlByAgent = async (
    formSetting: IConcurrentData,
    agents: string[] = []) => {
    agents.forEach(async (agent) => {
      const newFormSetting = {...formSetting, agent};
      await cluster.execute(newFormSetting);
    });
  };

  const handleDlByStatus = async (formSetting: IConcurrentData) => {
    ([
      '公開', '自社済み', '自社商談',
      '他社商談', '他社済み', '中止', '保留',
      '査定中',
    ] as TPropStatusText[])
      .forEach(async (statusText) => {
        const newFormSetting: IConcurrentData = {...formSetting, status: [statusText]};
        const {count = 0, agents} = await cluster
          .execute(newFormSetting) as IPropForm;

        if (count > downloadLimit) {
          logger.error(
            // eslint-disable-next-line max-len
            `handleDlByStatus: Found ${count} items at options : ${JSON.stringify(newFormSetting)}`,
          );
          handleDlByAgent(newFormSetting, agents);
        }
      });
  };


  const handleDlByPropType = async (formSetting: IConcurrentData) => {
    ([
      'tochi', 'new_kodate', 'used_kodate',
      'new_mansion', 'used_mansion', 'jigyou',

    ] as TPropTypes[])
      .forEach(async (propType)=>{
        const newFormSetting = {...formSetting, propType: [propType]};
        const {count = 0} = await cluster
          .execute(newFormSetting) as IPropForm;

        if (count > downloadLimit) {
          logger.error(
            // eslint-disable-next-line max-len
            `handleDlByPropType: Passing ${count} items to options : ${JSON.stringify(newFormSetting)}`,
          );
          handleDlByStatus(newFormSetting);
        }
      });
  };

  const handleDlByStore = async (store: string) => {
    const formSetting : IConcurrentData = {...initialForm ?? {}, store};
    const {count = 0} = await cluster.execute(formSetting) as IPropForm;

    if (count > downloadLimit) {
      logger.error(
        `handleDlByStore: Found ${count} items at options : ${JSON.stringify(formSetting)}`,
      );
      handleDlByPropType(formSetting);
    }
  };

  // stores.forEach(handleDlByStore);
  console.log(initialForm);
  const {stores, count = 0} = await cluster.execute(initialForm) as IPropForm;
  if (count > downloadLimit) {
    logger.error(
      `INITIAL: Found ${count} items at options : ${JSON.stringify(initialForm)}`,
    );
    stores.forEach(handleDlByStore);
  }
};
