import apis from '/@/lib/apis'

import { convertPartitionFromData } from './converter'
import type { PartitionSeed, Partition } from './model'

export const usePartitionRepository = () => {
  return createPartitionRepository()
}

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
    const { data } = await apis.postPartition(partition)
    return convertPartitionFromData(data)
  },
  editPartition: async (
    id: string,
    partition: PartitionSeed
  ): Promise<Partition> => {
    const { data } = await apis.putPartition(id, partition)
    return convertPartitionFromData(data)
  },
  deletePartition: async (id: string) => {
    await apis.deletePartition(id)
  }
})
