
import {cityLists, propertyTypes} from '../../config';
import {IAction, TProperty} from '../../types';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';
import {scrapeDtMansion} from './scrapeDtMansion';
import {handleContactScraper} from './handleContactScraper';
import {handlePrepareForm} from './handlePrepareForm';

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


export const actionsAtHome = () => {
  return Object.keys(cityLists)
    .reduce<IAction[]>((accu, pref) => {
    const actions = propertyTypes
      .map<IAction>((type) => {
      return {
        site: 'athome',
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
