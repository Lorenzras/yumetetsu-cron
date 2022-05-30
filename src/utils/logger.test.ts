import {browserTimeOut} from './../tasks/common/browser/config';
import {logger} from './logger';
test('logger', ()=>{
  logger.info('success');
  logger.error('error');
  logger.warn('warn');
}, browserTimeOut);
