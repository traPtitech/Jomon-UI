import { usePartitionGroupRepository } from './data/repository'
import type { PartitionGroup, PartitionGroupSeed } from './entities'
import type { User } from '@/features/user/entities'
import { defineStore, storeToRefs } from 'pinia'

const createDefaultPartitionGroupSeed = (): PartitionGroupSeed => ({
  name: '',
  parentPartitionGroupId: null,
  depth: 0
})

const createPartitionGroupStore = defineStore('partitionGroup', {
  state: () => ({
    partitionGroups: [] as PartitionGroup[],
    isPartitionGroupFetched: false,
    currentPartitionGroup: undefined as PartitionGroup | undefined,
    editedValue: createDefaultPartitionGroupSeed()
  }),
  getters: {
    partitionGroupOptions: state =>
      state.partitionGroups.map(group => ({
        key: group.name,
        value: group.id
      })),
    canEditPartitionGroup: () => (user: User | undefined) => {
      if (!user) return false
      return user.accountManager
    }
  },
  actions: {
    async fetchPartitionGroups() {
      const repository = usePartitionGroupRepository()
      try {
        this.partitionGroups = await repository.fetchPartitionGroups()
        this.isPartitionGroupFetched = true
      } catch (e) {
        throw new Error(
          'パーティショングループ一覧の取得に失敗しました: ' +
            (e instanceof Error ? e.message : String(e))
        )
      }
    },
    async fetchPartitionGroup(id: string) {
      const repository = usePartitionGroupRepository()
      try {
        const partitionGroup = await repository.fetchPartitionGroup(id)
        this.currentPartitionGroup = partitionGroup
        this.editedValue = {
          name: partitionGroup.name,
          parentPartitionGroupId: partitionGroup.parentPartitionGroupId,
          depth: partitionGroup.depth
        }
      } catch {
        throw new Error('パーティショングループの取得に失敗しました')
      }
    },
    async createPartitionGroup(partitionGroup: PartitionGroupSeed) {
      const repository = usePartitionGroupRepository()
      try {
        const res = await repository.createPartitionGroup(partitionGroup)
        this.partitionGroups.unshift(res)
      } catch {
        throw new Error('パーティショングループの作成に失敗しました')
      }
    },
    async editPartitionGroup(
      id: string,
      partitionGroupSeed: PartitionGroupSeed
    ) {
      if (!this.currentPartitionGroup) return
      const repository = usePartitionGroupRepository()
      try {
        const res = await repository.editPartitionGroup(id, partitionGroupSeed)
        this.currentPartitionGroup = res
        const index = this.partitionGroups.findIndex(
          partitionGroup => partitionGroup.id === res.id
        )
        if (index !== -1) {
          this.partitionGroups.splice(index, 1, res)
        }
      } catch {
        this.editedValue = {
          name: this.currentPartitionGroup.name,
          parentPartitionGroupId:
            this.currentPartitionGroup.parentPartitionGroupId,
          depth: this.currentPartitionGroup.depth
        }
        throw new Error('パーティショングループの更新に失敗しました')
      }
    },
    async deletePartitionGroup(id: string) {
      const repository = usePartitionGroupRepository()
      try {
        await repository.deletePartitionGroup(id)
        this.partitionGroups = this.partitionGroups.filter(
          partitionGroup => partitionGroup.id !== id
        )
      } catch {
        throw new Error('パーティショングループの削除に失敗しました')
      }
    },
    resetDetail() {
      this.currentPartitionGroup = undefined
      this.editedValue = createDefaultPartitionGroupSeed()
    }
  }
})

export const usePartitionGroupStore = () => {
  const store = createPartitionGroupStore()
  const refs = storeToRefs(store)

  return {
    ...refs,
    fetchPartitionGroups: store.fetchPartitionGroups.bind(store),
    fetchPartitionGroup: store.fetchPartitionGroup.bind(store),
    createPartitionGroup: store.createPartitionGroup.bind(store),
    editPartitionGroup: store.editPartitionGroup.bind(store),
    deletePartitionGroup: store.deletePartitionGroup.bind(store),
    resetDetail: store.resetDetail.bind(store)
  }
}

export type PartitionGroupStore = ReturnType<typeof usePartitionGroupStore>
