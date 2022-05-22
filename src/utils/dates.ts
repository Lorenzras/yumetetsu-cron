import {
  differenceInMonths,
  differenceInYears,
  getYear,
  isSameDay,
  parseISO,
  subDays,
  setYear,
  format} from 'date-fns';


export const getYearDiffFromToday = (dateStr : string) : number => {
  return differenceInYears(new Date(), parseISO(dateStr));
};

export const getMonthDiffFromToday = (dateStr : string) : number => {
  return differenceInMonths(new Date(), parseISO(dateStr));
};

export const isLessThan3MonthsFromToday = (dateStr : string) : boolean => {
  return getMonthDiffFromToday(dateStr) <= 3;
};

export const isSameMonthDay = (dateStr: string): boolean => {
  const adjustedYear = setYear(parseISO(dateStr), getYear(new Date()));
  const result = isSameDay(adjustedYear, new Date());
  // logger.info(`Same Day? ${dateStr} ${result}`);
  return result;
};

export const getDateYesterday = (dateFormat = 'yyyy-MM-dd') => {
  const nowDate = new Date();
  const dateYesterday = subDays(nowDate, 1);


  return format(dateYesterday, dateFormat);
};
