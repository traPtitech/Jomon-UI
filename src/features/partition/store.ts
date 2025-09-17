import { usePartitionRepository } from './data/repository'
import type { Partition, PartitionSeed } from './entities'
import type { User } from '@/features/user/entities'
import { defineStore, storeToRefs } from 'pinia'

const createDefaultPartitionSeed = (): PartitionSeed => ({
  name: '',
  budget: 0,
  management: {
    category: 'manual',
    state: 'available'
  }
})

const createPartitionStore = defineStore('partition', {
  state: () => ({
    partitions: [] as Partition[],
    isPartitionFetched: false,
    currentPartition: undefined as Partition | undefined,
    editedValue: createDefaultPartitionSeed() as PartitionSeed
  }),
  getters: {
    partitionOptions: state =>
      state.partitions.map(partition => ({
        key: partition.name,
        value: partition.id
      })),
    canEditPartition: () => (user: User | undefined) => {
      if (!user) return false
      return user.accountManager
    }
  },
  actions: {
    async fetchPartitions() {
      const repository = usePartitionRepository()
      try {
        this.partitions = await repository.fetchPartitions()
        this.isPartitionFetched = true
      } catch (e) {
        throw new Error('パーティション一覧の取得に失敗しました: ' + e)
      }
    },
    async fetchPartition(id: string) {
      const repository = usePartitionRepository()
      try {
        const partition = await repository.fetchPartition(id)
        this.currentPartition = partition
        this.editedValue = {
          name: partition.name,
          budget: partition.budget ?? 0,
          management: { ...partition.management }
        }
      } catch {
        throw new Error('パーティションの取得に失敗しました')
      }
    },
    async createPartition(partition: PartitionSeed) {
      const repository = usePartitionRepository()
      try {
        const res = await repository.createPartition(partition)
        this.partitions.unshift(res)
      } catch {
        throw new Error('パーティションの作成に失敗しました')
      }
    },
    async editPartition(id: string, partitionSeed: PartitionSeed) {
      if (!this.currentPartition) return
      const repository = usePartitionRepository()
      try {
        const res = await repository.editPartition(id, partitionSeed)
        this.currentPartition = res
        const index = this.partitions.findIndex(
          partition => partition.id === res.id
        )
        if (index !== -1) {
          this.partitions.splice(index, 1, res)
        }
      } catch {
        this.editedValue = {
          name: this.currentPartition.name,
          budget: this.currentPartition.budget ?? 0,
          management: { ...this.currentPartition.management }
        }
        throw new Error('パーティションの更新に失敗しました')
      }
    },
    async deletePartition(id: string) {
      const repository = usePartitionRepository()
      try {
        await repository.deletePartition(id)
        this.partitions = this.partitions.filter(
          partition => partition.id !== id
        )
      } catch {
        throw new Error('パーティションの削除に失敗しました')
      }
    },
    resetDetail() {
      this.currentPartition = undefined
      this.editedValue = createDefaultPartitionSeed()
    }
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
