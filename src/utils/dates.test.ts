import {format, intervalToDuration} from 'date-fns';
import {APP_IDS, kintoneClient} from '../api/kintone';
import {getYearDiffFromToday, isSameMonthDay, getDateYesterday} from './dates';

describe('Date', <
  U extends LongTermCustomerType,
  T extends keyof U
>()=>{
  it('retrieved year difference',
    async () => {
      const differences = (
        await kintoneClient
          .record
          .getRecords({
            app: APP_IDS.longTermCustomers,
            query: `${String('追客可能時期' as T)} = ""`,
          })
      )
        .records
        .map((record) => {
          const rec = record as unknown as U;
          return {
            dateFromRec: rec.receptionDate.value,
            dateToday: format(new Date(), 'yyyy-MM-dd'),
            difference: getYearDiffFromToday(rec.receptionDate.value),
          };
        });
      expect(differences).toMatchSnapshot();
    },
  );

  it('isSameDayMonth', async ()=> {
    const result = (
      await kintoneClient
        .record
        .getRecords({
          app: APP_IDS.longTermCustomers,
          query: `${String('追客可能時期' as T)} = ""`,
        })
    )
      .records
      .map((record) => {
        const rec = record as unknown as U;
        return {
          recordId: rec.$id.value,
          dateFromRec: rec.receptionDate.value,
          dateToday: format(new Date(), 'yyyy-MM-dd'),
          ans: isSameMonthDay(rec.receptionDate.value),
        };
      }).filter((res) => res.ans);
    expect(result).toMatchSnapshot();
  });

  it('yesterday', ()=>{
    expect(getDateYesterday()).toMatchSnapshot();
  });

  it('intervalDuration', ()=>{
    expect(intervalToDuration({
      start: new Date(1929, 0, 15, 12, 0, 0),
      end: new Date(),
    })).toMatchSnapshot();
  });
});
