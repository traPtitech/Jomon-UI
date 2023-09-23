import type { DateTime } from 'luxon'

export interface Group {
  id: string
  name: string
  description: string
  budget: number
  createdAt: DateTime
}

export interface GroupDetail extends Group {
  members: string[]
  owners: string[]
}

export interface GroupSeed {
  name: string
  description: string
  budget: number | null
}

export interface GroupSeedWithMemberAndOwners extends GroupSeed {
  members: string[]
  owners: string[]
}
