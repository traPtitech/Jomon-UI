import { DateTime } from 'luxon'

import type {
  Status as APIStatus,
  Comment as APIComment,
  RequestDetail as APIRequestDetail
} from '/@/lib/apis'

export interface Comment extends Omit<APIComment, 'created_at' | 'updated_at'> {
  created_at: DateTime
  updated_at: DateTime
}

export interface Status extends Omit<APIStatus, 'created_at'> {
  created_at: DateTime
}

export interface RequestDetail
  extends Omit<
    APIRequestDetail,
    'created_at' | 'updated_at' | 'comments' | 'statuses'
  > {
  created_at: DateTime
  updated_at: DateTime
  comments: Comment[]
  statuses: Status[]
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
