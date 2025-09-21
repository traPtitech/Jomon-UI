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
import apis from '@/lib/apis'

export const useApplicationRepository = () => {
  return createApplicationRepository()
}

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
    const applicationData = {
      title: application.title,
      content: application.content,
      targets: application.targets,
      tags: application.tags.map(tag => tag.id),
      partition: application.partition,
      created_by: application.createdBy
    }
    const { data } = await apis.postApplication(applicationData)

    return convertApplicationDetail(data)
  },

  editApplication: async (
    id: string,
    application: ApplicationSeed
  ): Promise<ApplicationDetail> => {
    const applicationData = {
      title: application.title,
      content: application.content,
      targets: application.targets,
      tags: application.tags.map(tag => tag.id),
      partition: application.partition,
      created_by: application.createdBy
    }
    const { data } = await apis.putApplicationDetail(id, applicationData)

    return convertApplicationDetail(data)
  },

  createComment: async (
    id: string,
    comment: string
  ): Promise<ApplicationComment> => {
    const commentData = {
      comment
    }
    const { data } = await apis.postComment(id, commentData)

    return convertApplicationCommentFromData(data)
  },

  editStatus: async (
    id: string,
    status: ApplicationStatus,
    comment: string
  ): Promise<ApplicationStatusDetail> => {
    const statusData = {
      status,
      comment
    }
    const { data } = await apis.putStatus(id, statusData)

    return convertApplicationStatusDetailFromData(data)
  }
})
