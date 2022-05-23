
import {scrapeDtHouse} from '../scrapeDtHouse';
import {scrapeDtMansion} from '../scrapeDtMansion';
import {scrapeDtLot} from '../scrapeDtLot';
import {IHouse, ILot, IMansion, IProperty,
  IPropertyAction, PropertyActions} from '../../../types';
import {Cluster} from 'puppeteer-cluster';
import {cityLists, dlPortalCheck, kintoneAppId} from '../../../config';
import {IClusterTaskData} from '../clusterScraper';
import {getContactByLink} from '../getContact/';
import {getFileName, logger, saveJSONToCSV} from '../../../../../../utils';
import {
  IPropSearchData,
  searchDoProperty} from '../../../doNetCompare/searchDoProperty';
import {TSearchResult} from '../../../doNetCompare/compareData';

const propertyActions: PropertyActions = [
  {
    type: '中古戸建',
    url: 'https://www.homes.co.jp/kodate/chuko/tokai/',
    handleScraper: scrapeDtHouse,
  },
  {
    type: '中古マンション',
    url: 'https://www.homes.co.jp/mansion/chuko/tokai/',
    handleScraper: scrapeDtMansion,
  },
  {
    type: '土地',
    url: 'https://www.homes.co.jp/tochi/tokai/',
    handleScraper: scrapeDtLot,
  },
];

/**
 * Parallel processing queuer.
 *
 * I consolidated queues here for HOMES, and I might refactor this to
 * accomodate scraper of other sites.
 *
 * Or, just seperate tasks for each scraper but I still have to find a way
 * for it make it use the same cluster to have better control on computer's
 * resources.
 *
 * Another approach is batching, but will be a little bit less efficient
 * as another batch of actions will not start unless the running batch is done.
 *
 * @param cluster
 */
export const byAction = async (
  cluster: Cluster<
  IClusterTaskData>,
) => {
  /* Compare to do */
  const handleDoNetCompare = async (
    property: IProperty | IHouse | IMansion | ILot,
  ) => {
    let propArea = '';
    if ('比較用専有面積' in property) {
      propArea = property.比較用専有面積.toString();
    } else if ('比較用土地面積' in property) {
      propArea = property.比較用土地面積.toString();
    }

    logger.info('Starting donetCompare.');
    const data: IPropSearchData = {
      address: property.所在地,
      propertyType: property.物件種別 || '中古戸建',
      price: property.比較用価格.toString(),
      area: propArea,
    };
    const result = (await cluster.execute(async ({page}) =>{
      return searchDoProperty({page, data});
    }))[0] as TSearchResult;

    return result;
  };

  /* Get contact */
  const handleGetContact = async (prop: IProperty) => {
    return await cluster.execute(async ({page}) => {
      const contact = await getContactByLink(page, prop.リンク);
      const withContact = {
        ...prop,
        ...contact,
      };
      return withContact;
    }) as IProperty;
  };

  /* Get complete data */
  const handleGetCompleteData = async (properties: IProperty[]) =>{
    return await Promise.all(properties.map(async (prop) => {
      const propWithContact = await handleGetContact(prop);
      const propDoCompared = await handleDoNetCompare(prop);
      const completeData = {...propWithContact, ...propDoCompared};
      return completeData;
    }));
  };

  /*
  Scrape by prefecture,
  get contacts for each link,
  then compare to Donet
   */
  const byPrefecture = async (action: IPropertyAction) => {
    return await Promise.all(Object.entries(cityLists).map(
      async ([pref, cities]) => {
        const results = await cluster
          .execute({
            ...action,
            ...{pref, cities: Object.keys(cities)},
          }) as IProperty[];

        const addedPropType = results
          .map((item) => ({...item, 物件種別: action.type}));

        const resultCompleteData = await handleGetCompleteData(addedPropType);

        return resultCompleteData;
      }));
  };

  /* Main queue emitter */
  propertyActions.forEach(async (action) => {
    const finalResults = await byPrefecture(action);


    finalResults
      .filter((d)=>d.length)
      .forEach((result) => {
        logger.info(`Saving file with ${result.length} lines. ${action.type}`);
        saveJSONToCSV(getFileName({
          appId: kintoneAppId,
          dir: dlPortalCheck,
          suffix: action.type,
        }), result);
      });
  });
};
