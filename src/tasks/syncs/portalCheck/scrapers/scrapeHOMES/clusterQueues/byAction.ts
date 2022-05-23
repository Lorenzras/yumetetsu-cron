
import {scrapeDtHouse} from '../scrapeDtHouse';
import {scrapeDtMansion} from '../scrapeDtMansion';
import {scrapeDtLot} from '../scrapeDtLot';
import {IProperty, IPropertyAction, PropertyActions} from '../../../types';
import {Cluster} from 'puppeteer-cluster';
import {cityLists, dlPortalCheck, kintoneAppId} from '../../../config';
import {IClusterTaskData} from '../clusterScraper';
import {getContactByLink} from '../getContact';
import {getFileName, saveJSONToCSV} from '../../../../../../utils';
import path from 'path';

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


export const byAction = async (
  cluster: Cluster<
  IClusterTaskData>,
) => {
  const handleGetContact = async (properties: IProperty[]) =>{
    return await Promise.all(properties.map(async (prop) => {
      return await cluster.execute(async ({page}) => {
        const contact = await getContactByLink(page, prop.リンク);
        return {...prop, ...contact};
      }) as IProperty;
    }));
  };

  const byPrefecture = async (action: IPropertyAction) => {
    return await Promise.all(Object.entries(cityLists).map(
      async ([pref, cities]) => {
        const results = await cluster
          .execute({...action, ...{pref, cities}}) as IProperty[];
        const resultWithContact = await handleGetContact(results);

        return resultWithContact;
      }));
  };

  propertyActions.forEach(async (action) => {
    const finalResults = await byPrefecture(action);
    finalResults.forEach((result) => {
      saveJSONToCSV(getFileName({
        appId: kintoneAppId,
        dir: dlPortalCheck,
      }), result);
    });
  });
};
