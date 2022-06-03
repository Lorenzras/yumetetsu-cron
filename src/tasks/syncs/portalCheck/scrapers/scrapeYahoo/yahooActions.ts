import {Page} from 'puppeteer';
import {cityLists} from '../../config';
import {IAction, TProperty} from '../../types';
import {prepareForm} from './prepareForm';
import {scrapeContact} from './scrapeContact';
import {scrapeDtMansion} from './scrapeDtMansion';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';

export const yahooActions = (): IAction[] => {
  return [
    /*  {
      pref: '愛知県',
      type: '中古マンション',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtMansion,
      handleContactScraper: scrapeContact,
    },
    {
      pref: '岐阜県',
      type: '中古マンション',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtMansion,
      handleContactScraper: scrapeContact,
    }, */
    /* {
      pref: '愛知県',
      type: '中古戸建',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtHouse,
      handleContactScraper: scrapeContact,
    },
    {
      pref: '岐阜県',
      type: '中古戸建',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtHouse,
      handleContactScraper: scrapeContact,
    },
    {
      pref: '愛知県',
      type: '土地',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtLot,
      handleContactScraper: scrapeContact,
    }, */
    {
      pref: '岐阜県',
      type: '土地',
      handlePrepareForm: prepareForm,
      handleScraper: scrapeDtLot,
      handleContactScraper: scrapeContact,
    },
  ];
};
