import {format} from 'date-fns';
import path from 'path';
import {saveJSON} from '../../../../../../utils';
import {metaDir} from '../config';

export const saveMeta = (
  title: string, json: Record<string, any>[],
) => saveJSON(
  `${path.join(metaDir, `${title}-${format(new Date(), 'yyyyMMdd-HHmmss')}`)}`,
  json,
);
