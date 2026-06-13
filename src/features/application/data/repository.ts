import apis, {
  type CommentInput,
  type PostApplicationInput,
  type PostApplicationTargetInput,
  type PutApplicationInput,
  type PutApplicationTargetInput,
  type StatusInput,
} from '@/lib/apis'

import { convertApplicationCommentFromData } from '@/features/applicationComment/data/converter'
import type { ApplicationComment } from '@/features/applicationComment/entities'
import { convertApplicationStatusDetailFromData } from '@/features/applicationStatus/data/converter'
import type {
  ApplicationStatus,
  ApplicationStatusDetail,
} from '@/features/applicationStatus/entities'

import type {
  Application,
  ApplicationDetail,
  ApplicationQuerySeed,
  PostApplicationSeed,
  PutApplicationSeed,
} from '../entities'
import { convertApplication, convertApplicationDetail } from './converter'

export const useApplicationRepository = () => {
  return createApplicationRepository()
}

const toPostApplicationTargetInput = (
  target: PostApplicationSeed['targets'][number]
): PostApplicationTargetInput => ({
  amount: target.amount,
  target: target.target,
})

const toPostApplicationInput = (
  application: PostApplicationSeed
): PostApplicationInput => ({
  created_by: application.createdBy,
  title: application.title,
  content: application.content,
  tags: application.tags.map(tag => tag.id),
  partition: application.partition,
  targets: application.targets.map(toPostApplicationTargetInput),
})

const toPutApplicationTargetInput = (
  target: PutApplicationSeed['targets'][number]
): PutApplicationTargetInput => ({
  ...target,
  paid_at: target.paidAt,
})

const toPutApplicationInput = (
  application: PutApplicationSeed
): PutApplicationInput => ({
  created_by: application.createdBy,
  title: application.title,
  content: application.content,
  tags: application.tags.map(tag => tag.id),
  partition: application.partition,
  targets: application.targets.map(toPutApplicationTargetInput),
})

const toCommentInput = (comment: string): CommentInput => ({
  comment,
})

const toStatusInput = (
  status: ApplicationStatus,
  comment: string
): StatusInput => ({
  status,
  comment,
})

const createApplicationRepository = () => ({
  fetchApplications: async (
    querySeed: ApplicationQuerySeed
  ): Promise<Application[]> => {
    const { data } = await apis.getApplications(
      querySeed.sort,
      querySeed.currentStatus !== '' ? querySeed.currentStatus : undefined,
      querySeed.target,
      querySeed.since,
      querySeed.until,
      querySeed.limit,
      querySeed.offset,
      querySeed.tags.join(','),
      querySeed.partition
    )

    return data.map(convertApplication)
  },

  fetchApplication: async (id: string): Promise<ApplicationDetail> => {
    const { data } = await apis.getApplicationDetail(id)

    return convertApplicationDetail(data)
  },

  createApplication: async (
    postApplicationSeed: PostApplicationSeed
  ): Promise<ApplicationDetail> => {
    const { data } = await apis.postApplication(
      toPostApplicationInput(postApplicationSeed)
    )

    return convertApplicationDetail(data)
  },

  editApplication: async (
    id: string,
    putApplicationSeed: PutApplicationSeed
  ): Promise<ApplicationDetail> => {
    const { data } = await apis.putApplicationDetail(
      id,
      toPutApplicationInput(putApplicationSeed)
    )

    return convertApplicationDetail(data)
  },

  createComment: async (
    id: string,
    comment: string
  ): Promise<ApplicationComment> => {
    const { data } = await apis.postComment(id, toCommentInput(comment))

    return convertApplicationCommentFromData(data)
  },

  editStatus: async (
    id: string,
    status: ApplicationStatus,
    comment: string
  ): Promise<ApplicationStatusDetail> => {
    const { data } = await apis.putStatus(id, toStatusInput(status, comment))

    return convertApplicationStatusDetailFromData(data)
  },
})
