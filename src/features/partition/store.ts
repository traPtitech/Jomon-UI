import { computed, inject, ref } from 'vue'

import { defineStoreComposable } from '@/lib/store'

import { PartitionRepositoryKey } from '@/di'
import type { User } from '@/features/user/entities'
import type { AsyncStatus } from '@/types'

import type { Partition, PartitionSeed } from './entities'

const createDefaultPartitionSeed = (): PartitionSeed => ({
  name: '',
  budget: 0,
  parentPartitionGroupId: '',
  management: {
    category: 'manual',
    state: 'available',
  },
})

export const usePartitionStore = defineStoreComposable('partition', () => {
  const repository = inject(PartitionRepositoryKey)
  if (!repository) throw new Error('PartitionRepository is not provided')

  const partitions = ref<Partition[]>([])
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)
  const currentPartition = ref<Partition | undefined>(undefined)
  const editedValue = ref<PartitionSeed>(createDefaultPartitionSeed())

  const partitionOptions = computed(() =>
    partitions.value.map(partition => ({
      label: partition.name,
      key: partition.id,
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
      partitions.value = await repository.fetchPartitions()
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      error.value =
        'パーティション一覧の取得に失敗しました: ' +
        (e instanceof Error ? e.message : String(e))
      throw new Error(error.value)
    }
  }

  const fetchPartition = async (id: string) => {
    try {
      const partition = await repository.fetchPartition(id)
      currentPartition.value = partition
      editedValue.value = {
        name: partition.name,
        budget: partition.budget,
        parentPartitionGroupId: partition.parentPartitionGroupId,
        management: { ...partition.management },
      }
    } catch {
      throw new Error('パーティションの取得に失敗しました')
    }
  }

  const createPartition = async (partition: PartitionSeed) => {
    try {
      const res = await repository.createPartition(partition)
      partitions.value.unshift(res)
    } catch {
      throw new Error('パーティションの作成に失敗しました')
    }
  }

  const editPartition = async (id: string, partitionSeed: PartitionSeed) => {
    if (!currentPartition.value) return
    try {
      const res = await repository.editPartition(id, partitionSeed)
      currentPartition.value = res
      const index = partitions.value.findIndex(
        partition => partition.id === res.id
      )
      if (index !== -1) {
        partitions.value.splice(index, 1, res)
      }
    } catch {
      editedValue.value = {
        name: currentPartition.value.name,
        budget: currentPartition.value.budget,
        parentPartitionGroupId: currentPartition.value.parentPartitionGroupId,
        management: { ...currentPartition.value.management },
      }
      throw new Error('パーティションの更新に失敗しました')
    }
  }

  const deletePartition = async (id: string) => {
    try {
      await repository.deletePartition(id)
      const index = partitions.value.findIndex(partition => partition.id === id)
      if (index !== -1) {
        partitions.value.splice(index, 1)
      }
    } catch {
      throw new Error('パーティションの削除に失敗しました')
    }
  }

  const resetDetail = () => {
    currentPartition.value = undefined
    editedValue.value = createDefaultPartitionSeed()
  }

  return {
    partitions,
    status,
    error,
    isPartitionFetched,
    currentPartition,
    editedValue,
    partitionOptions,
    canEditPartition,
    fetchPartitions,
    fetchPartition,
    createPartition,
    editPartition,
    deletePartition,
    resetDetail,
  }
})

export type PartitionStore = ReturnType<typeof usePartitionStore>
