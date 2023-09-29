import { DateTime } from 'luxon'

import type { Comment as CommentData } from '/@/lib/apis'

import type { RequestComment } from './model'

export const convertRequestCommentFromData = (
  comment: CommentData
): RequestComment => ({
  id: comment.id,
  user: comment.user,
  comment: comment.comment,
  createdAt: DateTime.fromISO(comment.created_at),
  updatedAt: DateTime.fromISO(comment.updated_at)
})
