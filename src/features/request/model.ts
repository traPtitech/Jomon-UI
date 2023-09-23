import type { DateTime } from 'luxon'

import type { RequestTarget } from '/@/lib/apis'

import type { Group } from '/@/features/group/model'
import type { RequestComment } from '/@/features/requestComment/model'
import type {
  RequestStatus,
  RequestStatusUnion
} from '/@/features/requestStatus/model'
import type { RequestTargetDetail } from '/@/features/requestTarget/model'
import type { Tag } from '/@/features/tag/model'

export interface Request {
  id: string
  status: RequestStatusUnion
  created_by: string
  title: string
  content: string
  targets: RequestTargetDetail[]
  tags: Tag[]
  group: Group | null
  createdAt: DateTime
}

export interface RequestQuerySeed {
  sort: string
  currentStatus: RequestStatusUnion | ''
  target: string
  since: string
  until: string
  tags: string[]
  group: string
}

export interface RequestDetail extends Request {
  files: string[]
  comments: RequestComment[]
  statuses: RequestStatus[]
}

export interface RequestSeed {
  createdBy: string
  title: string
  content: string
  targets: RequestTarget[]
  tags: Tag[]
  group: string | null
}
