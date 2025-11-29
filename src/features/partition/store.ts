import { usePartitionRepository } from './data/repository'
import type { Partition, PartitionSeed } from './entities'
import type { User } from '@/features/user/entities'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createDefaultPartitionSeed = (): PartitionSeed => ({
  name: '',
  budget: 0,
  parentPartitionGroupId: '',
  management: {
    category: 'manual',
    state: 'available'
  }
})

const createPartitionStore = defineStore('partition', () => {
  const partitions = ref<Partition[]>([])
  const isPartitionFetched = ref(false)
  const currentPartition = ref<Partition | undefined>(undefined)
  const editedValue = ref<PartitionSeed>(createDefaultPartitionSeed())

  const partitionOptions = computed(() =>
    partitions.value.map(partition => ({
      key: partition.name,
      value: partition.id
    }))
  )

  const canEditPartition = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.accountManager
  })

  const fetchPartitions = async () => {
    const repository = usePartitionRepository()
    try {
      partitions.value = await repository.fetchPartitions()
      isPartitionFetched.value = true
    } catch (e) {
      throw new Error(
        'パーティション一覧の取得に失敗しました: ' +
          (e instanceof Error ? e.message : String(e))
      )
    }
  }

  const fetchPartition = async (id: string) => {
    const repository = usePartitionRepository()
    try {
      const partition = await repository.fetchPartition(id)
      currentPartition.value = partition
      editedValue.value = {
        name: partition.name,
        budget: partition.budget,
        parentPartitionGroupId: partition.parentPartitionGroupId,
        management: { ...partition.management }
      }
    } catch {
      throw new Error('パーティションの取得に失敗しました')
    }
  }

  const createPartition = async (partition: PartitionSeed) => {
    const repository = usePartitionRepository()
    try {
      const res = await repository.createPartition(partition)
      partitions.value.unshift(res)
    } catch {
      throw new Error('パーティションの作成に失敗しました')
    }
  }

  const editPartition = async (id: string, partitionSeed: PartitionSeed) => {
    if (!currentPartition.value) return
    const repository = usePartitionRepository()
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
        management: { ...currentPartition.value.management }
      }
      throw new Error('パーティションの更新に失敗しました')
    }
  }

  const deletePartition = async (id: string) => {
    const repository = usePartitionRepository()
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
    resetDetail
  }
})

export const usePartitionStore = () => {
  const store = createPartitionStore()
  const refs = storeToRefs(store)

  return {
    ...refs,
    fetchPartitions: store.fetchPartitions,
    fetchPartition: store.fetchPartition,
    createPartition: store.createPartition,
    editPartition: store.editPartition,
    deletePartition: store.deletePartition,
    resetDetail: store.resetDetail
  }
}

export type PartitionStore = ReturnType<typeof usePartitionStore>
