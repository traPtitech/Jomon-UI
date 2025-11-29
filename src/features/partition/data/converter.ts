import type { Partition as ApiPartition } from '@/lib/apis'

import type { Partition } from '../entities'

export const convertPartitionFromData = (
  partition: ApiPartition
): Partition => ({
  id: partition.id,
  name: partition.name,
  budget: partition.budget,
  parentPartitionGroupId: partition.parent_partition_group,
  management: {
    category: partition.management.category,
    state: partition.management.state,
  },
  createdAt: partition.created_at,
  updatedAt: partition.updated_at,
})
