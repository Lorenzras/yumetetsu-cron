import winston, {format} from 'winston';
const {combine, timestamp, json} = format;

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({format: 'YYYY-MM-dd HH:mm:ss'}),
    json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'warning.log', level: 'warning'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
});
