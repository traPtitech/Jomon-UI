import type { DateTime } from 'luxon'

export interface RequestComment {
  id: string
  user: string
  comment: string
  createdAt: DateTime
  updatedAt: DateTime
}
