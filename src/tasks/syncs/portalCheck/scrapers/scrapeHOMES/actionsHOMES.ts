import {handleContactScraper} from './handleContactScraper';
import {cityLists, propertyTypes} from '../../config';
import {IAction, TProperty} from '../../types';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';
import {scrapeDtMansion} from './scrapeDtMansion';

import {handlePrepareForm} from './handlePrepareform';

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
      .map<IAction>((p) => {
      return {
        pref,
        type: p,
        handlePrepareform: handlePrepareForm,
        handleContactScraper: handleContactScraper,
        handleScraper: getScraperByPropType(p),
      };
    });
    return [...accu, ...actions];
  }, []);
};
