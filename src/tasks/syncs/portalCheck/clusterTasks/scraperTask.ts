import {saveJSONToCSV, getFileName} from './../../../../utils/file';
import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {TSearchResult} from '../doNetCompare/compareData';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {IAction, IProperty} from '../types';
import {dlPortalCheck, kintoneAppId} from '../config';

type TScraperTask = (
  actions: IAction[], cluster: Cluster<{page: Page}>
) => Promise<void>

export const scraperTask: TScraperTask = async (actions, cluster) => {
  const handlePerProperty = async (action: IAction, dtArr: IProperty[]) => {
    return await Promise.all(dtArr.map(async (dt) => {
      const resultWithContact = await cluster.execute(async ({page}) => {
        return await action.handleContactScraper(page, dt);
      }) as IProperty;

      const doNetComparedResults = await cluster.execute(async ({page}) => {
        return await searchDoProperty(
          {page, inputData: dt},
        );
      }) as TSearchResult[];


      return {
        ...resultWithContact,
        ...doNetComparedResults[0],
        物件種別: action.type,
      };
    }));
  };


  const handleAction = async (action: IAction) => {
    const {
      pref, type, handleScraper, handlePrepareform,
    } = action;

    const initialResult : IProperty[] = await cluster
      .execute(async ({page}) => {
        if (await handlePrepareform(page, pref, type)) {
          const res = await handleScraper(page);
          return res;
        }
        return [];
      });

    const completeData = await handlePerProperty(
      action, initialResult,
    );

    if (completeData.length) {
      // eslint-disable-next-line max-len
      await saveJSONToCSV(getFileName({
        appId: kintoneAppId,
        dir: dlPortalCheck,
        suffix: action.type,
      }), completeData);
    }

    return completeData;
  };

  actions.forEach(async (action) => {
    const completeData = await handleAction(action);
    console.log(completeData);
  });

/*
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


  const handleGetCompleteData = async (properties: IProperty[]) =>{
    return await Promise.all(properties.map(async (prop) => {
      const propWithContact = await handleGetContact(prop);
      const propDoCompared = await handleDoNetCompare(prop);
      const completeData: IProperty = {...propWithContact, ...propDoCompared};
      return completeData;
    }));
  };


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

        if (resultCompleteData.length) {
        // eslint-disable-next-line max-len
          logger
          .info(
            `Saving file with ${resultCompleteData
              .length} lines. ${action.type}`);
          await saveJSONToCSV(getFileName({
            appId: kintoneAppId,
            dir: dlPortalCheck,
            suffix: action.type,
          }), resultCompleteData);
        }
        return resultCompleteData;
      }));
  };


  propertyActions.forEach(async (action) => {
    const finalResults = await byPrefecture(action);


    finalResults
      .filter((d)=>d.length)
      .forEach((result) => {
        console.log(result.length);
      });
  }); */
};
