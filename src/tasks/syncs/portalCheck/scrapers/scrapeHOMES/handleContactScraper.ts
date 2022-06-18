import {THandleContactScraper} from '../../types';
import {getContactByLink} from './getContact/getContactByLink';

export const handleContactScraper:
THandleContactScraper = async (page, data) => {
  return {...data, ...await getContactByLink(page, data.リンク)};
};
