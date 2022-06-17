

import {IAction} from '../../types';
import {prepareForm} from './prepareForm';
import {scrapeContact} from './scrapeContact';
import {scrapeDtMansion} from './scrapeDtMansion';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';

export const yahooActions = (): IAction[] => {
  const actions: IAction[] = [
    {
      site: 'yahoo',
      pref: '愛知県',
      type: '中古マンション',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtMansion,
      handleContactScraper: scrapeContact,
    },
    {
      site: 'yahoo',
      pref: '岐阜県',
      type: '中古マンション',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtMansion,
      handleContactScraper: scrapeContact,
    },
    {
      site: 'yahoo',
      pref: '愛知県',
      type: '中古戸建',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtHouse,
      handleContactScraper: scrapeContact,
    },
    {
      site: 'yahoo',
      pref: '岐阜県',
      type: '中古戸建',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtHouse,
      handleContactScraper: scrapeContact,
    },
    {
      site: 'yahoo',
      pref: '愛知県',
      type: '土地',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtLot,
      handleContactScraper: scrapeContact,
    },
    {
      site: 'yahoo',
      pref: '岐阜県',
      type: '土地',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtLot,
      handleContactScraper: scrapeContact,
    },
  ];
  return actions;
};
