import apis from '/@/lib/apis'

import {
  convertRequestDetailFromData,
  convertRequestFromData
} from '/@/features/request/converter'
import type {
  Request,
  RequestDetail,
  RequestSeed
} from '/@/features/request/model'
import { convertRequestCommentFromData } from '/@/features/requestComment/converter'
import type { RequestComment } from '/@/features/requestComment/model'
import { convertRequestStatusFromData } from '/@/features/requestStatus/converter'
import type {
  RequestStatus,
  RequestStatusUnion
} from '/@/features/requestStatus/model'

export const useRequestRepository = () => {
  return createRequestRepository()
}

const createRequestRepository = () => ({
  fetchRequests: async (): Promise<Request[]> => {
    const { data } = await apis.getRequests()

    return data.map(convertRequestFromData)
  },

  fetchRequest: async (id: string): Promise<RequestDetail> => {
    const { data } = await apis.getRequestDetail(id)

    return convertRequestDetailFromData(data)
  },

  createRequest: async (request: RequestSeed): Promise<Request> => {
    const requestData = {
      title: request.title,
      content: request.content,
      targets: request.targets,
      tags: request.tags.map(tag => tag.id),
      group: request.group,
      created_by: request.createdBy
    }
    const { data } = await apis.postRequest(requestData)

    return convertRequestFromData(data)
  },

  editRequest: async (id: string, request: RequestSeed): Promise<Request> => {
    const requestData = {
      title: request.title,
      content: request.content,
      targets: request.targets,
      tags: request.tags.map(tag => tag.id),
      group: request.group,
      created_by: request.createdBy
    }
    const { data } = await apis.putRequestDetail(id, requestData)

    return convertRequestFromData(data)
  },

  createComment: async (
    id: string,
    comment: string
  ): Promise<RequestComment> => {
    const commentData = {
      comment
    }
    const { data } = await apis.postComment(id, commentData)

    return convertRequestCommentFromData(data)
  },

  editStatus: async (
    id: string,
    status: RequestStatusUnion,
    comment: string
  ): Promise<RequestStatus> => {
    const statusData = {
      status,
      comment
    }
    const { data } = await apis.putStatus(id, statusData)

    return convertRequestStatusFromData(data)
  }
})