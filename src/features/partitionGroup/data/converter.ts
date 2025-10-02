import type { PartitionGroup } from '../entities'
import type { PartitionGroup as ApiPartitionGroup } from '@/lib/apis'

export const convertPartitionGroupFromData = (
  partitionGroup: ApiPartitionGroup
): PartitionGroup => ({
  id: partitionGroup.id,
  name: partitionGroup.name,
  parentPartitionGroupId: partitionGroup.parent_partition_group,
  depth: partitionGroup.depth,
  createdAt: partitionGroup.created_at,
  updatedAt: partitionGroup.updated_at
})
