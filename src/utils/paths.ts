import appRoot from 'app-root-path';

import path from 'path';
/*
  Need to reorganize file structure
*/

export const rootPath = appRoot;

export const srcPath = appRoot.resolve('src');

export const tasksPath = path.join(srcPath, 'tasks');

export const syncsPath = path.join(tasksPath, 'syncs');

export const portalCheckPath = path.join(syncsPath, 'portalCheck');

export const logsPath = appRoot.resolve('logs');
export const dumpPath = appRoot.resolve('dump');

// Downloads
export const downloadsPath = appRoot.resolve('downloads');
export const excelPath = path.join(downloadsPath, 'excel');
export const jsonPath = path.join(downloadsPath, 'json');
export const csvPath = path.join(downloadsPath, 'csv');

// Assets
export const assetsPath = appRoot.resolve('assets');
export const imagesPath = path.join(assetsPath, 'images');
export const templatesPath = path.join(assetsPath, 'templates');


export const cookiesPath = appRoot.resolve('cookies');
export const archivePath = path.join(dumpPath, 'archive');


export {custDlDir} from '../tasks/common/doNet/config';

