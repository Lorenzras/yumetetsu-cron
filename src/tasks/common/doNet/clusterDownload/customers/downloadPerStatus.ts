import {TClusterPage} from '../../../browser/config';
import {custStatuses} from './config';
import {downloadProcess} from './downloadProcess';

export const downloadPerStatus = (
  cluster: TClusterPage, options: IFormOptions,
) => {
  return custStatuses
    .map<ReturnType<typeof downloadProcess>>((s) => cluster
    .execute(({page, worker: {id}}) => downloadProcess(
      page,
      {
        ...options,
        status: [s],
        workerId: id,
      },
    ) ));
};
