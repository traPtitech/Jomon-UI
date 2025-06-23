import { usePartitionStore } from '/@/stores/partition'

import type { Partition, PartitionSeed } from './model'
import { usePartitionRepository } from './repository'
import { usePartitionDetailStore } from '/@/stores/partitionDetail'

export const useFetchPartitionsUsecase = async () => {
  const repository = usePartitionRepository()
  const { partitions, isPartitionFetched } = usePartitionStore()

  try {
    partitions.value = await repository.fetchPartitions()
    isPartitionFetched.value = true
  } catch {
    throw new Error('パーティション一覧の取得に失敗しました')
  }
}

export const useFetchPartition = async (id: string) => {
  const repository = usePartitionRepository()
  const { partition, editedValue } = usePartitionDetailStore()

  try {
    partition.value = await repository.fetchPartition(id)
    editedValue.value = {
      name: partition.value.name,
      budget: partition.value.budget ?? 0,
      management: partition.value.management
    }
  } catch {
    throw new Error('パーティションの取得に失敗しました')
  }
}

export const createPartitionUsecase = async (partition: PartitionSeed) => {
  const repository = usePartitionRepository()
  const { partitions } = usePartitionStore()

  try {
    const res = await repository.createPartition(partition)
    partitions.value.unshift(res)
  } catch {
    throw new Error('パーティションの作成に失敗しました')
  }
}

export const editPartitionUsecase = async (
  id: string,
  partitionSeed: PartitionSeed
) => {
  const repository = usePartitionRepository()
  const { partition, editedValue } = usePartitionDetailStore()
  if (!partition.value) return

  try {
    const res = await repository.editPartition(id, partitionSeed)
    partition.value = res
  } catch {
    editedValue.value = {
      name: partition.value.name,
      budget: partition.value.budget ?? 0,
      management: partition.value.management
    }
    throw new Error('パーティションの更新に失敗しました')
  }
}

export const deletePartitionUsecase = async (id: string) => {
  const repository = usePartitionRepository()
  const { partitions } = usePartitionStore()

  try {
    await repository.deletePartition(id)
    partitions.value = partitions.value.filter((p: Partition) => p.id !== id)
  } catch {
    throw new Error('パーティションの削除に失敗しました')
  }
}
