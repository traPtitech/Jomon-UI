import { DateTime } from 'luxon'

import type { StatusDetail as ApplicationStatusData } from '/@/lib/apis'

import { convertApplicationCommentFromData } from '../applicationComment/converter'
import type { ApplicationStatusDetail } from './model'

export const convertApplicationStatusDetailFromData = (
  status: ApplicationStatusData
): ApplicationStatusDetail => ({
  createdBy: status.created_by,
  status: status.status,
  comment: status.comment
    ? convertApplicationCommentFromData(status?.comment)
    : undefined,
  createdAt: DateTime.fromISO(status.created_at)
})
