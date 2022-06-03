import {THandleContactScraper} from './../types';
import {handleContactScraper as homes} from '../scrapers/scrapeHOMES';
import {scrapeContact as suumo} from '../scrapers/scrapeSUUMO/scrapeContact';
import {
  handleContactScraper as atHome,
} from '../scrapers/scrapeAtHome/handleContactScraper';
import {scrapeContact as yahoo} from '../scrapers/scrapeYahoo/scrapeContact';

export const handleGetCompanyDetails:
THandleContactScraper = async (page, data) => {
  const url = data.リンク;
  if (url.includes('homes.co.jp')) {
    return homes(page, data);
  } else if (url.includes('suumo.jp')) {
    return suumo(page, data);
  } else if (url.includes('athome.co.jp')) {
    return atHome(page, data);
  } else if (url.includes('yahoo')) {
    return yahoo(page, data);
  } else {
    return data;
  }
};
