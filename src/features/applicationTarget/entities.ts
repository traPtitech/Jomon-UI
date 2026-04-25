import type { DateTime } from 'luxon'

export interface PostApplicationTargetSeed {
  amount: number
  target: string
}

export interface PutApplicationTargetSeed extends PostApplicationTargetSeed {
  paidAt: string | null
}

export interface ApplicationTargetDetail extends PutApplicationTargetSeed {
  id: string
  createdAt: DateTime
}

export interface PostApplicationTargetDraft {
  amount: number | null
  target: string
}
