import { computed, inject, ref } from 'vue'

import { defineStoreComposable } from '@/lib/store'

import { PartitionRepositoryKey } from '@/di'
import type { User } from '@/features/user/entities'
import type { AsyncStatus } from '@/types'

import type { Partition, PartitionSeed } from './entities'

export const usePartitionStore = defineStoreComposable('partition', () => {
  const repository = inject(PartitionRepositoryKey)
  if (!repository) throw new Error('PartitionRepository is not provided')

  const idToPartition = ref(new Map<string, Partition>())
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)

  const partitions = computed(() => Array.from(idToPartition.value.values()))

  const partitionOptions = computed(() =>
    partitions.value.map(partition => ({
      key: partition.name,
      value: partition.id,
    }))
  )

  const canEditPartition = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.accountManager
  })

  const isPartitionFetched = computed(() => status.value === 'success')

  const fetchPartitions = async () => {
    status.value = 'loading'
    error.value = null

    try {
      const partitions = await repository.fetchPartitions()
      idToPartition.value = new Map(
        partitions.map(partition => [partition.id, partition])
      )
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      error.value =
        'パーティション一覧の取得に失敗しました: ' +
        (e instanceof Error ? e.message : String(e))
      throw new Error(error.value, { cause: e })
    }
  }

  const fetchPartition = async (id: string) => {
    try {
      return await repository.fetchPartition(id)
    } catch {
      throw new Error('パーティションの取得に失敗しました')
    }
  }

  const createPartition = async (partition: PartitionSeed) => {
    try {
      const createdPartition = await repository.createPartition(partition)
      idToPartition.value.set(createdPartition.id, createdPartition)
    } catch {
      throw new Error('パーティションの作成に失敗しました')
    }
  }

  const editPartition = async (id: string, partitionSeed: PartitionSeed) => {
    try {
      const editedPartition = await repository.editPartition(id, partitionSeed)
      idToPartition.value.set(editedPartition.id, editedPartition)
    } catch {
      throw new Error('パーティションの更新に失敗しました')
    }
  }

  const deletePartition = async (id: string) => {
    try {
      await repository.deletePartition(id)
      idToPartition.value.delete(id)
    } catch {
      throw new Error('パーティションの削除に失敗しました')
    }
  }

  return {
    partitions,
    idToPartition,
    status,
    error,
    isPartitionFetched,
    partitionOptions,
    canEditPartition,
    fetchPartitions,
    fetchPartition,
    createPartition,
    editPartition,
    deletePartition,
  }
})

export type PartitionStore = ReturnType<typeof usePartitionStore>
