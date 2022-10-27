import type { StatusEnum } from '/@/lib/apis'

import clubBudgetRequestTemplate from '/@/md/clubBudgetRequest.md?raw'
import travelingExpenseRequestTemplate from '/@/md/travelingExpenseRequest.md?raw'

export type RequestStatus = typeof StatusEnum[keyof typeof StatusEnum]
export interface RequestStatusInterface {
  key: string
  value: RequestStatus
}

export const requestStatuses = [
  { state: 'submitted', jpn: '承認待ち' },
  { state: 'rejected', jpn: '却下' },
  { state: 'fix_required', jpn: '要修正' },
  { state: 'accepted', jpn: '承認済み' },
  { state: 'fully_repaid', jpn: '返済完了' }
] as const
export const stateToJpn = (state: RequestStatus | 'error') => {
  const status = requestStatuses.find(s => s.state === state)?.jpn
  return status ?? 'エラー'
}
export const requestStatusOptions = () => {
  return (
    requestStatuses.map(requestStatus => {
      return {
        key: requestStatus.jpn,
        value: requestStatus.state
      }
    }) ?? []
  )
}

export const requestTemplates = [
  { name: '部費利用申請', value: clubBudgetRequestTemplate },
  { name: '交通費申請', value: travelingExpenseRequestTemplate }
] as const

const requestTemplateNames = requestTemplates.map(v => v.name)
export type RequestTemplate = typeof requestTemplateNames[number]
