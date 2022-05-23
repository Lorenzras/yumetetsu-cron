
import {scrapeDtHouse} from '../scrapeDtHouse';
import {scrapeDtMansion} from '../scrapeDtMansion';
import {scrapeDtLot} from '../scrapeDtLot';
import {IProperty, IPropertyAction, PropertyActions} from '../../../types';
import {Cluster} from 'puppeteer-cluster';
import {cityLists} from '../../../config';
import {IClusterTaskData} from '../clusterScraper';
import {getContactByLink} from '../getContact';

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

  const byPrefecture = (action: IPropertyAction) => {
    Object.entries(cityLists).forEach(
      async ([pref, cities]) => {
        const results = await cluster
          .execute({...action, ...{pref, cities}}) as IProperty[];
        const resultWithContact = await handleGetContact(results);

        console.log(resultWithContact);
      });
  };

  for (const action of propertyActions) {
    byPrefecture(action);
  }
};
