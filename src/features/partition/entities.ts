export interface Partition {
  id: string
  name: string
  budget: number | null
  parentPartitionGroupId: string
  management: {
    category: 'manual'
    state: 'available' | 'unavailable'
  }
  createdAt: string
  updatedAt: string
}

export interface PartitionSeed {
  name: string
  budget: number | null
  parentPartitionGroupId: string
  management: {
    category: 'manual'
    state: 'available' | 'unavailable'
  }
}

export type PartitionSeedDraft = Omit<
  PartitionSeed,
  'parentPartitionGroupId'
> & {
  parentPartitionGroupId: string | null
}

export interface PartitionQuerySeed {
  name?: string
  budget?: number
  management?: {
    category?: 'manual'
    state?: 'available' | 'unavailable'
  }
  parentPartitionGroupId?: string
}
