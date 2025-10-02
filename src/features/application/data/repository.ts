import type {
  Application,
  ApplicationDetail,
  ApplicationQuerySeed,
  ApplicationSeed
} from '../entities'
import { convertApplication, convertApplicationDetail } from './converter'
import { convertApplicationCommentFromData } from '@/features/applicationComment/data/converter'
import type { ApplicationComment } from '@/features/applicationComment/entities'
import { convertApplicationStatusDetailFromData } from '@/features/applicationStatus/data/converter'
import type {
  ApplicationStatus,
  ApplicationStatusDetail
} from '@/features/applicationStatus/entities'
import apis, {
  type ApplicationInput,
  type ApplicationTargetInput,
  type CommentInput,
  type StatusInput
} from '@/lib/apis'

export const useApplicationRepository = () => {
  return createApplicationRepository()
}

const toApplicationTargetInput = (
  target: ApplicationSeed['targets'][number]
): ApplicationTargetInput => ({
  amount: target.amount,
  target: target.target
})

const toApplicationInput = (
  application: ApplicationSeed
): ApplicationInput => ({
  created_by: application.createdBy,
  title: application.title,
  content: application.content,
  tags: application.tags.map(tag => tag.id),
  partition: application.partition,
  targets: application.targets.map(toApplicationTargetInput)
})

const toCommentInput = (comment: string): CommentInput => ({
  comment
})

const toStatusInput = (
  status: ApplicationStatus,
  comment: string
): StatusInput => ({
  status,
  comment
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
    application: ApplicationSeed
  ): Promise<ApplicationDetail> => {
    const { data } = await apis.postApplication(toApplicationInput(application))

    return convertApplicationDetail(data)
  },

  editApplication: async (
    id: string,
    application: ApplicationSeed
  ): Promise<ApplicationDetail> => {
    const { data } = await apis.putApplicationDetail(
      id,
      toApplicationInput(application)
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
  }
})
