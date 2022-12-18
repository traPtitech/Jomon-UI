import { DateTime } from 'luxon'

import type {
  Status as APIStatus,
  Comment as APIComment,
  RequestDetail as APIRequestDetail,
  Request as APIRequest,
  Transaction as APITransaction
} from '/@/lib/apis'

import type {
  Comment,
  Status,
  RequestDetail,
  Request,
  Transaction
} from './apiTypes'

export const formatDate = (date: DateTime) => {
  const dateStr = date.toFormat('yyyy/MM/dd')
  return dateStr
}

export const formatDateAndTime = (date: DateTime) => {
  const dateStr = date.toFormat('yyyy/MM/dd HH:mm')
  return dateStr
}

export const convertRequest = (response: APIRequest[]): Request[] => {
  return response.map((request: APIRequest) => ({
    ...request,
    created_at: DateTime.fromISO(request.created_at),
    updated_at: DateTime.fromISO(request.updated_at)
  }))
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

export const convertTransaction = (
  response: APITransaction[]
): Transaction[] => {
  return response.map((transaction: APITransaction) => {
    return {
      ...transaction,
      created_at: DateTime.fromISO(transaction.created_at),
      updated_at: DateTime.fromISO(transaction.updated_at)
    }
  })
}
