import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {searchDoProperty} from '../doNetCompare/searchDoProperty';
import {IAction, IProperty} from '../types';

type TScraperTask = (
  actions: IAction[], cluster: Cluster<{page: Page}>
) => Promise<void>

export const scraperTask: TScraperTask = async (actions, cluster) => {
  const handleGetContacts = async (action: IAction, result: IProperty[]) => {
    return await Promise.all(result.map(async (r) => {
      return await cluster.execute(({page}) => {
        return action.handleContactScraper(page, r);
      }) as IProperty;
    }));
  };

  const handleDoNetCompare = async (result: IProperty[]) => {
    return await Promise.all(result.map(async (r) => {
      return await cluster.execute(async ({page}) => {
        const result = await searchDoProperty({page, inputData: r});
        return {...r, ...result[0]};
      }) as IProperty;
    }));
  };


  const handleAction = async (action: IAction) => {
    const {
      pref, type, handleScraper, handlePrepareform,
    } = action;

    const result : IProperty[] = await cluster.execute(async ({page}) => {
      if (await handlePrepareform(page, pref, type)) {
        const initialResult = await handleScraper(page, type);
        const resultWithContact = await handleGetContacts(
          action, initialResult,
        );
        const completeData = await handleDoNetCompare(resultWithContact);

        return completeData;
      }
      return [];
    });

    return result;
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
