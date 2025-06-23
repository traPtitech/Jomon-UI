import type { DateTime } from 'luxon'

export interface ApplicationComment {
  id: string
  user: string
  comment: string
  createdAt: DateTime
  updatedAt: DateTime
}
