import {TClusterPage} from '../../../browser/config';
import {getOptionsEmployee} from '../../pages/customer';
import {downloadProcess} from './downloadProcess';


export const downloadPerAgents = (
  cluster: TClusterPage,
  options: IFormOptions,
  agents: AsyncReturnType<typeof getOptionsEmployee>,
) => {
  return agents
    .map<ReturnType<typeof downloadProcess>>((agent) => cluster
    .execute(({page, worker: {id}}) => downloadProcess(
      page,
      {
        ...options,
        agentId: agent.value,
        workerId: id,
      },
    )),
  );
};
