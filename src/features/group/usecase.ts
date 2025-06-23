import { useGroupStore } from '/@/stores/group'

import type { Partition, PartitionSeed } from './model'
import { usePartitionRepository } from './repository'
import { useGroupDetailStore } from '/@/stores/groupDetail'

export const useFetchGroupsUsecase = async () => {
  const repository = usePartitionRepository()
  const { groups, isGroupFetched } = useGroupStore()

  try {
    groups.value = await repository.fetchPartitions()
    isGroupFetched.value = true
  } catch {
    throw new Error('パーティション一覧の取得に失敗しました')
  }
}

export const useFetchGroup = async (id: string) => {
  const repository = usePartitionRepository()
  const { group, editedValue } = useGroupDetailStore()

  try {
    group.value = await repository.fetchPartition(id)
    editedValue.value = {
      name: group.value.name,
      budget: group.value.budget ?? 0,
      management: group.value.management
    }
  } catch {
    throw new Error('パーティションの取得に失敗しました')
  }
}

export const createGroupUsecase = async (partition: PartitionSeed) => {
  const repository = usePartitionRepository()
  const { groups } = useGroupStore()

  try {
    const res = await repository.createPartition(partition)
    groups.value.unshift(res)
  } catch {
    throw new Error('パーティションの作成に失敗しました')
  }
}

export const editGroupUsecase = async (
  id: string,
  partitionSeed: PartitionSeed
) => {
  const repository = usePartitionRepository()
  const { group, editedValue } = useGroupDetailStore()
  if (!group.value) return

  try {
    const res = await repository.editPartition(id, partitionSeed)
    group.value = res
  } catch {
    editedValue.value = {
      name: group.value.name,
      budget: group.value.budget ?? 0,
      management: group.value.management
    }
    throw new Error('パーティションの更新に失敗しました')
  }
}

export const deleteGroupUsecase = async (id: string) => {
  const repository = usePartitionRepository()
  const { groups } = useGroupStore()

  try {
    await repository.deletePartition(id)
    groups.value = groups.value.filter((p: Partition) => p.id !== id)
  } catch {
    throw new Error('パーティションの削除に失敗しました')
  }
}
