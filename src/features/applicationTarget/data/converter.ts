import type { ApplicationTargetDetail } from '../entities'
import type { ApplicationTarget as ApplicationTargetData } from '@/lib/apis'
import { DateTime } from 'luxon'

export const convertApplicationTargetFromData = (
  target: ApplicationTargetData
): ApplicationTargetDetail => ({
  id: target.id,
  amount: target.amount,
  target: target.target,
  paidAt: target.paid_at,
  createdAt: DateTime.fromISO(target.created_at)
})
