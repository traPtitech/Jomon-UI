import { DateTime } from 'luxon'

import type { Comment as CommentData } from '@/lib/apis'

import type { ApplicationComment } from '../entities'

export const convertApplicationCommentFromData = (
  comment: CommentData
): ApplicationComment => ({
  id: comment.id,
  user: comment.user,
  comment: comment.comment,
  createdAt: DateTime.fromISO(comment.created_at),
  updatedAt: DateTime.fromISO(comment.updated_at)
})
