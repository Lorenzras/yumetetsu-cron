import {THandleContactScraper} from '../../types';
import {getContactByLink} from './getContact/getContactByLink';

export const handleContactScraper:
THandleContactScraper = async (page, data) => {
  const result = await getContactByLink(page, data.リンク);

  return {...data, ...result};
};
