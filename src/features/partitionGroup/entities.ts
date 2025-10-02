export interface PartitionGroup {
  id: string
  name: string
  parentPartitionGroupId: string | null
  depth: number
  createdAt: string
  updatedAt: string
}

export interface PartitionGroupSeed {
  name: string
  parentPartitionGroupId: string | null
  depth: number
}
