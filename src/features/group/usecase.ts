import { usePartitonStore } from '/@/stores/partiton'

import type { Partition, PartitionSeed } from './model'
import { usePartitionRepository } from './repository'
import { usePartitonDetailStore } from '/@/stores/partitonDetail'

export const useFetchPartitonsUsecase = async () => {
  const repository = usePartitionRepository()
  const { partitons, isPartitonFetched } = usePartitonStore()

  try {
    partitons.value = await repository.fetchPartitions()
    isPartitonFetched.value = true
  } catch {
    throw new Error('パーティション一覧の取得に失敗しました')
  }
}

export const useFetchPartiton = async (id: string) => {
  const repository = usePartitionRepository()
  const { partiton, editedValue } = usePartitonDetailStore()

  try {
    partiton.value = await repository.fetchPartition(id)
    editedValue.value = {
      name: partiton.value.name,
      budget: partiton.value.budget ?? 0,
      management: partiton.value.management
    }
  } catch {
    throw new Error('パーティションの取得に失敗しました')
  }
}

export const createPartitonUsecase = async (partition: PartitionSeed) => {
  const repository = usePartitionRepository()
  const { partitons } = usePartitonStore()

  try {
    const res = await repository.createPartition(partition)
    partitons.value.unshift(res)
  } catch {
    throw new Error('パーティションの作成に失敗しました')
  }
}

export const editPartitonUsecase = async (
  id: string,
  partitionSeed: PartitionSeed
) => {
  const repository = usePartitionRepository()
  const { partiton, editedValue } = usePartitonDetailStore()
  if (!partiton.value) return

  try {
    const res = await repository.editPartition(id, partitionSeed)
    partiton.value = res
  } catch {
    editedValue.value = {
      name: partiton.value.name,
      budget: partiton.value.budget ?? 0,
      management: partiton.value.management
    }
    throw new Error('パーティションの更新に失敗しました')
  }
}

export const deletePartitonUsecase = async (id: string) => {
  const repository = usePartitionRepository()
  const { partitons } = usePartitonStore()

  try {
    await repository.deletePartition(id)
    partitons.value = partitons.value.filter((p: Partition) => p.id !== id)
  } catch {
    throw new Error('パーティションの削除に失敗しました')
  }
}
