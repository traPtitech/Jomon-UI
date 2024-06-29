import { DateTime } from 'luxon'

import type {
  Request as RequestData,
  RequestDetail as RequestDetailData
} from '/@/lib/apis'

import { convertGroupFromData } from '/@/features/group/converter'
import { convertRequestCommentFromData } from '/@/features/requestComment/converter'
import { convertRequestStatusFromData } from '/@/features/requestStatus/converter'
import { convertRequestTargetFromData } from '/@/features/requestTarget/converter'

import type { Request, RequestDetail } from './model'

export const convertRequestFromData = (request: RequestData): Request => ({
  id: request.id,
  status: request.status,
  createdBy: request.created_by,
  title: request.title,
  content: request.content,
  targets: request.targets.map(convertRequestTargetFromData),
  tags: request.tags,
  group: request.group ? convertGroupFromData(request.group) : request.group,
  createdAt: DateTime.fromISO(request.created_at)
})

export const convertRequestDetailFromData = (
  request: RequestDetailData
): RequestDetail => ({
  id: request.id,
  status: request.status,
  createdBy: request.created_by,
  title: request.title,
  content: request.content,
  targets: request.targets.map(convertRequestTargetFromData),
  tags: request.tags,
  group: request.group ? convertGroupFromData(request.group) : request.group,
  createdAt: DateTime.fromISO(request.created_at),
  files: request.files,
  comments: request.comments.map(convertRequestCommentFromData),
  statuses: request.statuses.map(convertRequestStatusFromData)
})
