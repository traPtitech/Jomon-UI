import type { DateTime } from 'luxon'

export interface RequestTarget {
  amount: number
  target: string
}

export interface RequestTargetDetail extends RequestTarget {
  id: string
  paidAt: string | null
  createdAt: DateTime
}
