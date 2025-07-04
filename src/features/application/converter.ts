import type {
  Application as ApiApplication,
  ApplicationDetail as ApiApplicationDetail
} from '/@/lib/apis/generated/api'

import { convertApplicationCommentFromData } from '/@/features/applicationComment/converter'
import { convertApplicationStatusDetailFromData } from '/@/features/applicationStatus/converter'
import { convertApplicationTargetFromData } from '/@/features/applicationTarget/converter'
import { convertPartitionFromData } from '/@/features/partition/converter'

import { DateTime } from 'luxon'
import type { Application, ApplicationDetail } from './model'

export const convertApplication = (
  application: ApiApplication
): Application => ({
  id: application.id,
  status: application.status,
  createdBy: application.created_by,
  title: application.title,
  content: application.content,
  targets: application.targets.map(convertApplicationTargetFromData),
  tags: application.tags,
  partition: convertPartitionFromData(application.partition),
  createdAt: DateTime.fromISO(application.created_at),
  updatedAt: DateTime.fromISO(application.updated_at)
})

export const convertApplicationDetail = (
  application: ApiApplicationDetail
): ApplicationDetail => ({
  id: application.id,
  status: application.status,
  createdBy: application.created_by,
  title: application.title,
  content: application.content,
  targets: application.targets.map(convertApplicationTargetFromData),
  tags: application.tags,
  partition: convertPartitionFromData(application.partition),
  createdAt: DateTime.fromISO(application.created_at),
  updatedAt: DateTime.fromISO(application.updated_at),
  files: application.files,
  comments: application.comments.map(convertApplicationCommentFromData),
  statuses: application.statuses.map(convertApplicationStatusDetailFromData)
})
