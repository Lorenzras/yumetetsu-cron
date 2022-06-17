import {Page} from 'puppeteer';
import {IAction, TProperty} from '../../types';
import {prepareForm} from './prepareForm';
import {scrapeContact} from './scrapeContact';
import {scrapeDtApartment} from './scrapeDtApartment';
import {scrapeDtHouse} from './scrapeDtHouse';
import {scrapeDtLot} from './scrapeDtLot';
import {scrapeLoop} from './scrapeLoop';

const getScrapeFunc = (type: TProperty) => {
  switch (type) {
    case '中古マンション':
      return (page:Page) => scrapeLoop(page, scrapeDtApartment);
    case '中古戸建':
      return (page:Page) => scrapeLoop(page, scrapeDtHouse);
    case '土地':
      return (page:Page) => scrapeLoop(page, scrapeDtLot);
    default: throw new Error('handleScraper: Please provide proptype.');
  }
};

export const suumoActions = (): IAction[] => {
  return [
    {
      site: 'suumo',
      pref: '愛知県',
      type: '中古マンション',
      handlePrepareForm: prepareForm,
      handleScraper: getScrapeFunc('中古マンション'),
      handleContactScraper: scrapeContact,
    },
    {
      site: 'suumo',
      pref: '岐阜県',
      type: '中古マンション',
      handlePrepareForm: prepareForm,
      handleScraper: getScrapeFunc('中古マンション'),
      handleContactScraper: scrapeContact,
    },
    {
      site: 'suumo',
      pref: '愛知県',
      type: '中古戸建',
      handlePrepareForm: prepareForm,
      handleScraper: getScrapeFunc('中古戸建'),
      handleContactScraper: scrapeContact,
    },
    {
      site: 'suumo',
      pref: '岐阜県',
      type: '中古戸建',
      handlePrepareForm: prepareForm,
      handleScraper: getScrapeFunc('中古戸建'),
      handleContactScraper: scrapeContact,
    },
    {
      site: 'suumo',
      pref: '愛知県',
      type: '土地',
      handlePrepareForm: prepareForm,
      handleScraper: getScrapeFunc('土地'),
      handleContactScraper: scrapeContact,
    },
    {
      site: 'suumo',
      pref: '岐阜県',
      type: '土地',
      handlePrepareForm: prepareForm,
      handleScraper: getScrapeFunc('土地'),
      handleContactScraper: scrapeContact,
    },
  ];
};
