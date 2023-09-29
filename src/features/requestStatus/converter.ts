import { DateTime } from 'luxon'

import type { Status as RequestStatusData } from '/@/lib/apis'

import type { RequestStatusDetail } from '/@/features/requestStatus/model'

export const convertRequestStatusFromData = (
  status: RequestStatusData
): RequestStatusDetail => ({
  createdBy: status.created_by,
  status: status.status,
  createdAt: DateTime.fromISO(status.created_at)
})
