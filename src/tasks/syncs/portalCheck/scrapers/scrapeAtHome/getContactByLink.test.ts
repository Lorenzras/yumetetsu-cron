import {openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {getContactByLink} from './getContactByLink';

// https://www.athome.co.jp/kodate/1022733165

test('getContact', async ()=>{
  const page = await openMockBrowserPage();
  const urls = [
    'https://www.athome.co.jp/kodate/1022733165',
    'https://www.athome.co.jp/tochi/1040134670/',
    'https://www.athome.co.jp/mansion/1066314746/',
    'https://www.athome.co.jp/kodate/3915789702/',
    'https://www.athome.co.jp/kodate/1031689167/',
    'https://www.athome.co.jp/kodate/3915824302/',
  ];

  const result = [];
  for (const url of urls) {
    console.log('Processing url ', url);
    const pageRes = await getContactByLink(page, url);
    console.log(pageRes);
    result.push( {...pageRes, url});
  }


  expect(result).toMatchSnapshot();
  page.browser().disconnect();
}, browserTimeOut);

// https://www.athome.co.jp/kodate/3915789702/
// https://www.athome.co.jp/kodate/3915824302/
// https://www.athome.co.jp/kodate/1031689167/
