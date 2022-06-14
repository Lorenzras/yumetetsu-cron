
import path from 'path';
import winston, {format} from 'winston';
import {logsPath} from './paths';
const {combine, timestamp, json, prettyPrint} = format;
import {format as dateFormat} from 'date-fns';

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
    new winston.transports.File({
      filename: path.join(
        logsDatedPath, `error.log`,
      ),
      level: 'error'}),
    new winston.transports.File({
      filename: path.join(
        logsDatedPath, `combined.log`,
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({filename: 'exceptions.log'}),
  ],
});
