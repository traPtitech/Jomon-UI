import type { DateTime } from 'luxon'

import type { StatusEnum } from '@/lib/apis'

import type { ApplicationComment } from '@/features/applicationComment/entities'

export interface ApplicationStatusDetail {
  createdBy: string
  status: ApplicationStatus
  comment?: ApplicationComment | undefined
  createdAt: DateTime
}

export const applicationStatusOptions = [
  { key: 'pending_review', label: '提出済み' },
  { key: 'change_requested', label: '要修正' },
  { key: 'approved', label: '承認済み' },
  { key: 'rejected', label: '却下' },
  { key: 'payment_finished', label: '支払い済み' },
] as const

export type ApplicationStatus = (typeof StatusEnum)[keyof typeof StatusEnum]
