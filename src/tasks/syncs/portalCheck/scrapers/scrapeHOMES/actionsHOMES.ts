
import {cityLists, propertyTypes} from '../../config';
import {IAction, TProperty} from '../../types';
import {
  scrapeDtHouse,
  scrapeDtLot,
  scrapeDtMansion,
  handleContactScraper,
  handlePrepareForm,
} from './';

export const getScraperByPropType = (propType: TProperty) => {
  switch (propType) {
    case '中古戸建':
      return scrapeDtHouse;
    case '中古マンション':
      return scrapeDtMansion;
    case '土地':
      return scrapeDtLot;
    default: throw new Error('handleScraper: Please provide proptype.');
  }
};


export const actionsHOMES = () => {
  return Object.keys(cityLists)
    .reduce<IAction[]>((accu, pref) => {
    const actions = propertyTypes
      .map<IAction>((type) => {
      return {
        site: 'homes',
        pref,
        type,
        handlePrepareForm,
        handleContactScraper,
        handleScraper: getScraperByPropType(type),
      };
    });
    return [...accu, ...actions];
  }, []);
};
