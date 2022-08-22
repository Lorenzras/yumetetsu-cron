import path from 'path';
import {KStoreSettings} from '../../../../config';
import {initCluster} from '../../../common/browser';
import {browserTimeOut} from '../../../common/browser/config';
import {uploadFiles} from './uploadFiles';


describe('files', () => {
  it('should combine', async () => {
    const cluster = await initCluster({
      maxConcurrency: 5,
    });

    const test: {
      storeId: string
      filePath: string
    }[] = ['157', '270', '403'].map((el) => {
      return {
        storeId: el,
        filePath: path.join(
          __dirname,
          '..',
          'fileProcessing', 'csv', `${el}.csv`),
      };
    });

    const result = await uploadFiles(cluster, test );
    // console.log('Rows : ' + result.length);
    await cluster.idle();
    await cluster.close();
    expect(result).toMatchSnapshot();
  }, browserTimeOut);
});
