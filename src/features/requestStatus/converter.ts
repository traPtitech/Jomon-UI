import { DateTime } from 'luxon'

import type { Status as RequestStatusData } from '/@/lib/apis'

import type { RequestStatus } from '/@/features/requestStatus/model'

export const convertRequestStatusFromData = (
  status: RequestStatusData
): RequestStatus => ({
  createdBy: status.created_by,
  status: status.status,
  createdAt: DateTime.fromISO(status.created_at)
})
