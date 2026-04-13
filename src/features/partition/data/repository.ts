import apis, { type PartitionInput } from '@/lib/apis'

import type { Partition, PartitionSeed } from '../entities'
import { convertPartitionFromData } from './converter'

export const usePartitionRepository = () => {
  return createPartitionRepository()
}

const toPartitionInput = (partition: PartitionSeed): PartitionInput => ({
  name: partition.name,
  budget: partition.budget,
  parent_partition_group: partition.parentPartitionGroupId,
  management: partition.management,
})

const createPartitionRepository = () => ({
  fetchPartitions: async (): Promise<Partition[]> => {
    const { data } = await apis.getPartitions()

    return data.map(convertPartitionFromData)
  },
  fetchPartition: async (id: string): Promise<Partition> => {
    const { data } = await apis.getPartition(id)

    return convertPartitionFromData(data)
  },
  createPartition: async (partition: PartitionSeed): Promise<Partition> => {
    const { data } = await apis.postPartition(toPartitionInput(partition))
    return convertPartitionFromData(data)
  },
  editPartition: async (
    id: string,
    partition: PartitionSeed
  ): Promise<Partition> => {
    const { data } = await apis.putPartition(id, toPartitionInput(partition))
    return convertPartitionFromData(data)
  },
  deletePartition: async (id: string) => {
    await apis.deletePartition(id)
  },
})
