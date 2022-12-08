import { DateTime } from 'luxon'

import type {
  Status as APIStatus,
  Comment as APIComment,
  RequestDetail as APIRequestDetail
} from '/@/lib/apis'

import type { Comment, Status, RequestDetail } from './requestDetailTypes'

export const formatDate = (date: DateTime) => {
  const dateStr = date.toFormat('yyyy/MM/dd')
  return dateStr
}

export const formatDateAndTime = (date: DateTime) => {
  const dateStr = date.toFormat('yyyy/MM/dd HH:mm')
  return dateStr
}

export const convertRequestDetail = (
  response: APIRequestDetail
): RequestDetail => {
  const comments: Comment[] = response.comments.map((comment: APIComment) => {
    return {
      ...comment,
      created_at: DateTime.fromISO(comment.created_at),
      updated_at: DateTime.fromISO(comment.updated_at)
    }
  })
  const statuses: Status[] = response.statuses.map((status: APIStatus) => {
    return {
      ...status,
      created_at: DateTime.fromISO(status.created_at)
    }
  })
  return {
    ...response,
    comments: comments,
    statuses: statuses,
    created_at: DateTime.fromISO(response.created_at),
    updated_at: DateTime.fromISO(response.updated_at)
  }
}
