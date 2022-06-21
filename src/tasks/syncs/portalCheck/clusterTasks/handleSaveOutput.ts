import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {getFileName, saveJSONToCSV, logger} from '../../../../utils';
import {kintoneAppId, resultCSVPath} from '../config';
import {saveToExcel} from '../excelTask/saveToExcel';
import {saveMeta} from '../helpers/saveMeta';
import {IProperty} from '../types';
import {uploadTask} from './uploadTask';

export const handleSaveOutput = async ({
  doComparedDt,
  finalResults,
  saveToNetWorkDrive = true,
  startTime,
  cluster,
}:
{
  cluster: Cluster<{page: Page}>
  startTime: Date,
  doComparedDt: IProperty[],
  finalResults: IProperty[],
  saveToNetWorkDrive?: boolean
}) => {
  await saveToExcel(finalResults, saveToNetWorkDrive);


  // Save to CSV then upload to kintone
  const csvFile = await saveJSONToCSV(getFileName({
    appId: kintoneAppId,
    dir: resultCSVPath,
    suffix: `${finalResults.length.toString()}`,
  }), finalResults);

  saveMeta({
    beforeGetContact: doComparedDt,
    afterGetContact: finalResults,
    saveToNetWorkDrive,
    startTime,
  });


  logger.info(`Done saving to CSV. Starting to save to upload to kintone.`);
  if (csvFile) {
    try {
      await cluster.execute(({page})=> uploadTask(page, csvFile));
      logger.info(`Done uploading to kintone.`);
    } catch (err: any) {
      logger.error(`Upload to kintone might have failed. ${err.message}`);
    }
  } else {
    logger.info(`Did not upload to kintone. CSV file was empty.`);
  }
};
