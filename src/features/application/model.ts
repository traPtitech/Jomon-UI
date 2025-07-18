import { DateTime } from 'luxon'
import type { ApplicationComment } from '/@/features/applicationComment/model'
import type {
  ApplicationStatus,
  ApplicationStatusDetail
} from '/@/features/applicationStatus/model'
import type {
  ApplicationTarget,
  ApplicationTargetDetail
} from '/@/features/applicationTarget/model'
import type { Partition } from '/@/features/partition/model'
import type { Tag } from '/@/features/tag/model'

export interface Application {
  id: string
  status: ApplicationStatus
  createdBy: string
  title: string
  content: string
  targets: ApplicationTargetDetail[]
  tags: Tag[]
  partition: Partition
  createdAt: DateTime
  updatedAt: DateTime
}

export interface ApplicationDetail extends Application {
  files: string[]
  comments: ApplicationComment[]
  statuses: ApplicationStatusDetail[]
}

export interface ApplicationQuerySeed {
  sort: string
  currentStatus: ApplicationStatus | ''
  target: string
  since: string
  until: string
  limit: number
  offset: number
  tags: string[]
  partition: string
}

export interface ApplicationSeed {
  createdBy: string
  title: string
  content: string
  tags: Tag[]
  partition: string
  targets: ApplicationTarget[]
}
