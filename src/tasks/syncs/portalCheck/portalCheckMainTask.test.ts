import {actionsHOMES} from './scrapers/scrapeHOMES/';
import {browserTimeOut} from '../../common/browser/config';
import {portalCheckMainTask} from './portalCheckMainTask';
import _ from 'lodash';

describe('portalCheckMainProcess', ()=>{
  test('main', async ()=>{
    await portalCheckMainTask();
    expect('');
  }, browserTimeOut);

  test('shuffle', ()=>{
    const origArr = [
      {num: 1},
      {num: 2},
      {num: 3},
      {num: 4},
      {num: 5},
      {num: 6},
    ];
    expect(_.shuffle(actionsHOMES())).toMatchSnapshot();
  }, browserTimeOut);
});
