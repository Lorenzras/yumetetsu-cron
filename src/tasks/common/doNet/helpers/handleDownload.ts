
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
  }:
  {
    page: Page,
    requestURL: string,
    downloadDir: string,
    appId: string,
  },
) => {
  logger.info(`Download dir is ${downloadDir}`);

  try {
    const result = await page.evaluate((requestURL)=>{
      return fetch(requestURL, {
        method: 'GET',
        credentials: 'include',
        headers: [['charset', 'ISO-8859-1']],
      })
        .then((res) => res.arrayBuffer())
        .then((buffer)=>{
          const decoder = new TextDecoder('shift-jis');

          const text =
            decoder.decode(buffer)
              .replace(/([0-5]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])/g, '$1:$2');
          return text;
        });
    }, requestURL);

    /* .then((res) => {
          return res.arrayBuffer();
        })
        .then((buffer) => {
          const decoder = new TextDecoder('shift-jis');
          // eslint-disable-next-line max-len
          const text =
          decoder.decode(buffer)
          .replace(/([0-5]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])/g, '$1:$2');
          return text;
        }).catch((err)=>{
          console.error(err.message);
          return '';
        }); */


    logger.info(
    // eslint-disable-next-line max-len
      `Finished file download with ${result?.split(/\r\n|\r|\n/).length || 0} lines. `,
    );

    if (!result) return;

    const filePath = path.join(
      downloadDir,
      format(new Date(), `${appId}-yyyyMMdd-HHmmss`),
    ) + `-${nanoid(5)}.csv`;

    fs.writeFileSync(
      filePath,
      iconv.encode(result, 'shift_jis'),
    );

    return filePath;
  } catch (err: any) {
    logger.error('Failed saving file. ' + err.message);
    await notifyDev('Error downloading files' + err.message);
  }
};
