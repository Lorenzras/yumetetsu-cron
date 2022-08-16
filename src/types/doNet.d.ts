type TCustStatus =
| '追客中'
| '買付(契約予定)'
| '契約済み'
| '決済済み'
| '中止'
| '他決'
| '自社買取'
| '投資家'


interface IFormOptions {
  /** 店舗番号 */
  storeId: string,
  /** ステータス(状態) */
  status?: TCustStatus[]
  agentId?: string,
  updatedFrom?: Date,
  updateUntil?: Date
  workerId?: number,
}
