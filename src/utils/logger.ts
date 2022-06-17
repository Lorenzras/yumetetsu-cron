
import path from 'path';
import winston, {format} from 'winston';
import {logsPath} from './paths';
const {combine, timestamp, json, prettyPrint} = format;
import {format as dateFormat} from 'date-fns';
import DailyRotateFile from 'winston-daily-rotate-file';

const combinedTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'combined-%DATE%.log',
  dirname: logsPath,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const errTransport : DailyRotateFile = new DailyRotateFile({
  filename: 'error-%DATE%.log',
  dirname: logsPath,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'warn',
});

export const logsDatedPath = path.join(
  logsPath,
  dateFormat(new Date(), 'yyyy.MM.dd'),
);

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    json(),
    prettyPrint(),
  ),
  transports: [
    new winston.transports.Console(),
    combinedTransport,
    errTransport,
  ],
  exceptionHandlers: [
    new winston.transports.File({filename: 'exceptions.log'}),
  ],
});
