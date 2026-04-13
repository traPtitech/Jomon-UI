import apis, { type PartitionGroupInput } from '@/lib/apis'

import type { PartitionGroup, PartitionGroupSeed } from '../entities'
import { convertPartitionGroupFromData } from './converter'

export const usePartitionGroupRepository = () => {
  return createPartitionGroupRepository()
}

const toPartitionGroupInput = (
  partitionGroup: PartitionGroupSeed
): PartitionGroupInput => ({
  name: partitionGroup.name,
  parent_partition_group: partitionGroup.parentPartitionGroupId,
  depth: partitionGroup.depth,
})

const createPartitionGroupRepository = () => ({
  fetchPartitionGroups: async (): Promise<PartitionGroup[]> => {
    const { data } = await apis.getPartitionGroups()

    return data.map(convertPartitionGroupFromData)
  },
  fetchPartitionGroup: async (id: string): Promise<PartitionGroup> => {
    const { data } = await apis.getPartitionGroup(id)

    return convertPartitionGroupFromData(data)
  },
  createPartitionGroup: async (
    partitionGroup: PartitionGroupSeed
  ): Promise<PartitionGroup> => {
    const { data } = await apis.postPartitionGroup(
      toPartitionGroupInput(partitionGroup)
    )
    return convertPartitionGroupFromData(data)
  },
  editPartitionGroup: async (
    id: string,
    partitionGroup: PartitionGroupSeed
  ): Promise<PartitionGroup> => {
    const { data } = await apis.putPartitionGroup(
      id,
      toPartitionGroupInput(partitionGroup)
    )
    return convertPartitionGroupFromData(data)
  },
  deletePartitionGroup: async (id: string) => {
    await apis.deletePartitionGroup(id)
  },
})
