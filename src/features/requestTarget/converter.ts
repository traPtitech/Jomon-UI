import { DateTime } from 'luxon'

import type { ApplicationTargetDetail as RequestTargetDetailData } from '/@/lib/apis'

import type { ApplicationTargetDetail } from './model'

export const convertRequestTargetFromData = (
  target: RequestTargetDetailData
): ApplicationTargetDetail => ({
  id: target.id,
  amount: target.amount,
  target: target.target,
  paidAt: target.paid_at,
  createdAt: DateTime.fromISO(target.created_at)
})
