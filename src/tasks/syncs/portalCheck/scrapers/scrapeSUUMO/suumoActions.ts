import {IAction} from '../../types';
import {prepareForm} from './prepareForm';
import {scrapeContact} from './scrapeContact';
import {scrapeDtApartment} from './scrapeDtApartment';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';

export const suumoActions = (): IAction[] => {
  return [
    {
      pref: '愛知県',
      type: '中古マンション',
      handleScraper: scrapeDtApartment,
      handleContactScraper: scrapeContact,
      handlePrepareform: prepareForm,
    },
    {
      pref: '岐阜県',
      type: '中古マンション',
      handleScraper: scrapeDtApartment,
      handleContactScraper: scrapeContact,
      handlePrepareform: prepareForm,
    },
    {
      pref: '愛知県',
      type: '中古戸建',
      handleScraper: scrapeDtHouse,
      handleContactScraper: scrapeContact,
      handlePrepareform: prepareForm,
    },
    {
      pref: '岐阜県',
      type: '中古戸建',
      handleScraper: scrapeDtHouse,
      handleContactScraper: scrapeContact,
      handlePrepareform: prepareForm,
    },
    {
      pref: '愛知県',
      type: '土地',
      handleScraper: scrapeDtLot,
      handleContactScraper: scrapeContact,
      handlePrepareform: prepareForm,
    },
    {
      pref: '岐阜県',
      type: '土地',
      handleScraper: scrapeDtLot,
      handleContactScraper: scrapeContact,
      handlePrepareform: prepareForm,
    },
  ];
};
