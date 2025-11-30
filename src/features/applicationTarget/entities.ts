import type { DateTime } from 'luxon'

export interface ApplicationTarget {
  amount: number
  target: string | null
}

export interface ApplicationTargetDetail extends ApplicationTarget {
  id: string
  paidAt: string | null
  createdAt: DateTime
}

export interface ApplicationTargetDraft {
  amount: number | null
  target: string | null
}
