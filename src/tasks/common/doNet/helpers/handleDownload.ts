
import {Page} from 'puppeteer';
import fs from 'fs';
import {logger, notifyDev} from '../../../../utils';

import path from 'path';
import {format} from 'date-fns';

import iconv from 'iconv-lite';
import {nanoid} from 'nanoid/non-secure';

export const handleDownload = async (
  {
    page, requestURL, downloadDir, appId,
    prefix = '',
    suffix = '',
    encoding = 'shift_jis',
    removeTimeFromDate = true,
  }:
  {
    page: Page,
    requestURL: string, // https://manage.do-network.com/customer/ListCsvDownload
    downloadDir: string,
    appId: string,
    removeTimeFromDate?: boolean,
    prefix?: string,
    suffix?: string
    encoding?: 'shift_jis' | 'utf8'
  },
) => {
  logger.info(`Executing fetch.`);
  let filePath = '';
  try {
    const result = await page.evaluate((requestURL, removeTimeFromDate)=>{
      return fetch(requestURL, {
        method: 'GET',
        credentials: 'include',
        headers: [['charset', 'ISO-8859-1']],
      })
        .then((res) => res.arrayBuffer())
        .then((buffer)=>{
          const decoder = new TextDecoder('shift-jis');

          let text = decoder
            .decode(buffer);

          if (removeTimeFromDate) {
            text = text
              .replace(/([0-5]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])/g, '$1:$2');
          }

          return text;
        });
    }, requestURL, removeTimeFromDate);


    logger.info(
    // eslint-disable-next-line max-len
      `Finished file download with ${result?.split(/\r\n|\r|\n/).length || 0} lines. `,
    );

    if (!result) return;

    fs.existsSync(downloadDir) || fs.mkdirSync(downloadDir, {recursive: true});

    filePath = [
      path.join(
        downloadDir,
        format(new Date(), `${appId}-${prefix}-yyyyMMdd-HHmmss`),
      ),
      suffix,
      `${nanoid(5)}.csv`]
      .join('-');

    logger.info(`Saving to ${filePath}`);

    fs.writeFileSync(
      filePath,
      iconv.encode(result, encoding),
    );

    return filePath;
  } catch (err: any) {
    logger.error(`Failed saving file. ${filePath} ${err.message}`);
    // await notifyDev('Error downloading files' + err.message);
  }
};
