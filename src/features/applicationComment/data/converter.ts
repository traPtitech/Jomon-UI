import type { ApplicationComment } from '../entities'
import type { Comment as CommentData } from '@/lib/apis'
import { DateTime } from 'luxon'

export const convertApplicationCommentFromData = (
  comment: CommentData
): ApplicationComment => ({
  id: comment.id,
  user: comment.user,
  comment: comment.comment,
  createdAt: DateTime.fromISO(comment.created_at),
  updatedAt: DateTime.fromISO(comment.updated_at)
})
