import {browserTimeOut} from '../../../common/browser/config';
import {processCSV} from './processCSV';

describe('files', () => {
  it('should combine', async () => {
    const result = await processCSV();

    /**
     * * 要件定義 * *
     * https://trello.com/c/7ngDKObb
     *
     *
     * * テスト要件 * *
     *
     * - donetから以下のディレクターに顧客CSVファイルが必要
     *   src\tasks\common\doNet\clusterDownload\customers\csv
     * ファイルがない場合、一回jest customers/downloadCustomersの実行が必要
     *
     * */
    Object.entries(result).forEach(([storeKey, records]) => {
      console.log(`Checking ${storeKey}`);
      expect(
        records.every(
          ({
            顧客ステータス, 電話番号, メールアドレス,
          }) => 顧客ステータス.trim() && (電話番号.trim() || メールアドレス.trim()),
        ),
      ).toBe(true);
    });
  }, browserTimeOut);
});
