import type { DateTime } from 'luxon'

import type { StatusEnum } from '/@/lib/apis'

import type { ApplicationComment } from '/@/features/applicationComment/model'

export interface ApplicationStatusDetail {
  createdBy: string
  status: ApplicationStatus
  comment?: ApplicationComment
  createdAt: DateTime
}

export const applicationStatusOptions = [
  { value: 'submitted', key: '提出済み' },
  { value: 'change_requested', key: '要修正' },
  { value: 'approved', key: '承認済み' },
  { value: 'rejected', key: '却下' },
  { value: 'payment_finished', key: '支払い済み' }
] as const

export type ApplicationStatus = (typeof StatusEnum)[keyof typeof StatusEnum]
