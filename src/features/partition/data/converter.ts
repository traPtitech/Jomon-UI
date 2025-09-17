import type { Partition } from '../entities'
import type { Partition as ApiPartition } from '/@/lib/apis'

export const convertPartitionFromData = (
  partition: ApiPartition
): Partition => ({
  id: partition.id,
  name: partition.name,
  budget: partition.budget ?? 0,
  management: {
    category: partition.management.category,
    state: partition.management.state
  },
  createdAt: partition.created_at,
  updatedAt: partition.updated_at
})
