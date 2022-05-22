import {Page} from 'puppeteer';
import {getOptionsEmployee} from './content';
import {logger} from '../../../../../utils';
import selectors from './selectors';
import {clickSearch} from './clickSearch';
import {handleDownload} from './handleDownload';

export const downloadPerAgent = async (page: Page) =>{
  const agents = await getOptionsEmployee(page);

  console.log(agents);

  for (const agent of agents) {
    logger.info(`Selected agent - ${agent.text} `);
    await page.select(selectors.ddAgents, agent.value);
    const count = await clickSearch(page);
    if (count > 0 ) {
      await handleDownload(page);
    }
  }

  return page;
};
