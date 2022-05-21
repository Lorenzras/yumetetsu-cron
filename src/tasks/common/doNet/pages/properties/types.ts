import {Cluster} from 'puppeteer-cluster';
export type TPropTypes =
| 'tochi'
| 'new_kodate'
| 'used_kodate'
| 'new_mansion'
| 'used_mansion'
| 'jigyou'

export type TPropStatusText =
| '公開'
| '自社済み'
| '自社商談'
| '他社済み'
| '他社商談'
| '中止'
| '保留'
| '査定中'

export interface IConcurrentData {
  store: string,
  agent?: string,
  propType?: TPropTypes[]
  status?: TPropStatusText[]

}
