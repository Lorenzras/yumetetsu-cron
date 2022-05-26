import {Page} from 'puppeteer';
import {Cluster} from 'puppeteer-cluster';
import {openBrowserPage, openMockBrowserPage} from '../../../../common/browser';
import {browserTimeOut} from '../../../../common/browser/config';
import {initCluster} from '../../portalCheckMainTask';
import {getContactByLink} from './getContactByLink';

// https://www.athome.co.jp/kodate/1022733165

test('getContact', async ()=>{
  // const page = await openBrowserPage();
  const cluster: Cluster<{page: Page}> = await initCluster();
  const urls = [
    'https://www.athome.co.jp/tochi/1086414643',
    'https://www.athome.co.jp/tochi/1040134670/',
    'https://www.athome.co.jp/mansion/1066314746/',
    'https://www.athome.co.jp/kodate/3915789702/',
    'https://www.athome.co.jp/kodate/1031689167/',
    'https://www.athome.co.jp/kodate/3915824302/',
  ];

  const result: any[] = await Promise.all(
    urls.map(async (url)=>{
      const pageRes = await cluster.execute(({page})=>{
        return getContactByLink(page, url);
      });

      return {...pageRes, url};
    }),
  );


  /*   for (const url of urls) {
    console.log('Processing url ', url);

    const pageRes = await cluster.execute(({page})=>{
      return getContactByLink(page, url);
    });
    console.log(pageRes);
    result.push( {...pageRes, url});
  } */


  expect(result).toMatchSnapshot();
  await cluster.idle();
  await cluster.close();
}, browserTimeOut);

// https://www.athome.co.jp/kodate/3915789702/
// https://www.athome.co.jp/kodate/3915824302/
// https://www.athome.co.jp/kodate/1031689167/
