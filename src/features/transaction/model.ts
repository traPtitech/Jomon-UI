import type { DateTime } from 'luxon'

import type { Group } from '/@/features/group/model'
import type { Tag } from '/@/features/tag/model'

export interface Transaction {
  id: string
  title: string
  amount: number
  target: string
  request: string | null
  tags: Tag[]
  group: Group | null
  createdAt: DateTime
}

export interface TransactionQuerySeed {
  sort: string
  target: string
  since: string
  until: string
  tags: string[]
  group: string
  request: string
}

export interface TransactionCreateSeed {
  title: string
  amount: number
  targets: string[]
  request: string | null
  tags: Tag[]
  group: string | null
}

export interface TransactionEditSeed {
  title: string
  amount: number
  target: string
  request: string | null
  tags: Tag[]
  group: string | null
}
