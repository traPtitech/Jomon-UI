import type { DateTime } from 'luxon'

export interface RequestTargetDetail {
  id: string
  amount: number
  target: string
  paidAt: string | null
  createdAt: DateTime
}
