import {Page} from 'puppeteer';
import {login as loginDonet} from '../../common/doNet';
import {doNetDownload} from './doNet/downloadAll';

export const syncDonetToKasika = async (page: Page) => {
  await doNetDownload();
};
