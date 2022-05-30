import {openMockBrowserPage} from '../../../../common/browser';
import {splitCities} from './splitCities';

test('splitCities', async () => {
  // const page = await openMockBrowserPage;
  await splitCities('愛知県', 0);
  await splitCities('愛知県', 1);
});
