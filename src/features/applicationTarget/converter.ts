import { DateTime } from 'luxon'

import type { ApplicationTargetDetail as ApplicationTargetDetailData } from '/@/lib/apis'

import type { ApplicationTargetDetail } from './model'

export const convertApplicationTargetFromData = (
  target: ApplicationTargetDetailData
): ApplicationTargetDetail => ({
  id: target.id,
  amount: target.amount,
  target: target.target,
  paidAt: target.paid_at,
  createdAt: DateTime.fromISO(target.created_at)
})
