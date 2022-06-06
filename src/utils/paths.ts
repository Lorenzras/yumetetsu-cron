import appRoot from 'app-root-path';

import path from 'path';


export const rootPath = appRoot;
export const logsPath = appRoot.resolve('logs');
export const dumpPath = appRoot.resolve('dump');
export const cookiesPath = appRoot.resolve('cookies');
export const archivePath = path.join(dumpPath, 'archive');


export {custDlDir} from '../tasks/common/doNet/config';

