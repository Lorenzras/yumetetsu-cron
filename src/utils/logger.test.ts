import {browserTimeOut} from './../tasks/common/browser/config';
import {logger} from './logger';
test('logger', ()=>{
  logger.info('Info message');
  logger.error('error message');
  logger.warn('warn message');
}, browserTimeOut);
