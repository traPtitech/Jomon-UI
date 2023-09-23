import type { DateTime } from 'luxon'

import type { StatusEnum } from '/@/lib/apis'

import type { RequestComment } from '/@/features/requestComment/model'

export interface RequestStatus {
  createdBy: string
  status: RequestStatusUnion
  comment?: RequestComment
  createdAt: DateTime
}

const requestStatuses: { state: RequestStatusUnion; jpn: string }[] = [
  { state: 'submitted', jpn: '承認待ち' },
  { state: 'rejected', jpn: '却下' },
  { state: 'fix_required', jpn: '要修正' },
  { state: 'accepted', jpn: '承認済み' },
  { state: 'completed', jpn: '返済完了' }
]

export const requestStatusOptions = () =>
  requestStatuses.map(requestStatus => ({
    key: requestStatus.jpn,
    value: requestStatus.state
  }))

export type RequestStatusUnion = typeof StatusEnum[keyof typeof StatusEnum]
