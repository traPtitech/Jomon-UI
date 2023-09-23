import { DateTime } from 'luxon'

import type { RequestTargetDetail as RequestTargetDetailData } from '/@/lib/apis'

import type { RequestTargetDetail } from '/@/features/requestTarget/model'

export const convertRequestTargetFromData = (
  target: RequestTargetDetailData
): RequestTargetDetail => ({
  id: target.id,
  amount: target.amount,
  target: target.target,
  paidAt: target.paid_at,
  createdAt: DateTime.fromISO(target.created_at)
})
