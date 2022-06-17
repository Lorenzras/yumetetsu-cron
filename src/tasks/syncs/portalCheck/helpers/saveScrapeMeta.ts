import {hostname} from 'os';
import {IActionResult} from '../types';
import {format} from 'date-fns';
import beautify from 'json-beautify';
import {resolveResultDir} from '../config';
import path from 'path';
import {saveFile} from '../../../../utils';


export const saveScrapeMeta = (
  actionResults: IActionResult[],
  saveToNetWorkDrive = true,
) => {
  const result = actionResults.reduce((accu, curr) => {
    accu['合計'] += 1;
    const {result, ...resultOmitted} = curr;
    if (curr.isSuccess) {
      accu['成功']['件数'] += 1;
      accu['成功']['結果'].push(resultOmitted);
    } else {
      accu['失敗']['件数'] += 1;
      accu['失敗']['結果'].push(resultOmitted);
    }
    return accu;
  }, {
    合計: 0,
    失敗: {
      件数: 0,
      結果: [] as IActionResult[],
    },
    成功: {
      件数: 0,
      結果: [] as IActionResult[],
    },
  });

  const prettyResult = beautify({
    日時: format(new Date(), 'yyyy.MM.dd HH:mm:ss'),
    パソコン名: hostname(),
    ...result,
  }, null as any, 2, 80);


  saveFile(
    path.join(resolveResultDir(saveToNetWorkDrive), 'metaActions.json'),
    prettyResult,
  );
};
