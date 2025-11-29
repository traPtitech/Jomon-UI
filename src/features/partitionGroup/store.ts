import { usePartitionGroupRepository } from './data/repository'
import type { PartitionGroup, PartitionGroupSeed } from './entities'
import type { User } from '@/features/user/entities'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createDefaultPartitionGroupSeed = (): PartitionGroupSeed => ({
  name: '',
  parentPartitionGroupId: null,
  depth: 0
})

const createPartitionGroupStore = defineStore('partitionGroup', () => {
  const partitionGroups = ref<PartitionGroup[]>([])
  const isPartitionGroupFetched = ref(false)
  const currentPartitionGroup = ref<PartitionGroup | undefined>(undefined)
  const editedValue = ref<PartitionGroupSeed>(createDefaultPartitionGroupSeed())

  const partitionGroupOptions = computed(() =>
    partitionGroups.value.map(group => ({
      key: group.name,
      value: group.id
    }))
  )

  const canEditPartitionGroup = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.accountManager
  })

  const partitionGroupIdNameToMap = computed(() => {
    return new Map(partitionGroups.value.map(group => [group.id, group.name]))
  })

  const fetchPartitionGroups = async () => {
    const repository = usePartitionGroupRepository()
    try {
      partitionGroups.value = await repository.fetchPartitionGroups()
      isPartitionGroupFetched.value = true
    } catch (e) {
      throw new Error(
        'パーティショングループ一覧の取得に失敗しました: ' +
          (e instanceof Error ? e.message : String(e))
      )
    }
  }

  const fetchPartitionGroup = async (id: string) => {
    const repository = usePartitionGroupRepository()
    try {
      const partitionGroup = await repository.fetchPartitionGroup(id)
      currentPartitionGroup.value = partitionGroup
      editedValue.value = {
        name: partitionGroup.name,
        parentPartitionGroupId: partitionGroup.parentPartitionGroupId,
        depth: partitionGroup.depth
      }
    } catch {
      throw new Error('パーティショングループの取得に失敗しました')
    }
  }

  const createPartitionGroup = async (partitionGroup: PartitionGroupSeed) => {
    const repository = usePartitionGroupRepository()
    try {
      const res = await repository.createPartitionGroup(partitionGroup)
      partitionGroups.value.unshift(res)
    } catch {
      throw new Error('パーティショングループの作成に失敗しました')
    }
  }

  const editPartitionGroup = async (
    id: string,
    partitionGroupSeed: PartitionGroupSeed
  ) => {
    if (!currentPartitionGroup.value) return
    const repository = usePartitionGroupRepository()
    try {
      const res = await repository.editPartitionGroup(id, partitionGroupSeed)
      currentPartitionGroup.value = res
      const index = partitionGroups.value.findIndex(
        group => group.id === res.id
      )
      if (index !== -1) {
        partitionGroups.value.splice(index, 1, res)
      }
    } catch {
      editedValue.value = {
        name: currentPartitionGroup.value.name,
        parentPartitionGroupId:
          currentPartitionGroup.value.parentPartitionGroupId,
        depth: currentPartitionGroup.value.depth
      }
      throw new Error('パーティショングループの更新に失敗しました')
    }
  }

  const deletePartitionGroup = async (id: string) => {
    const repository = usePartitionGroupRepository()
    try {
      await repository.deletePartitionGroup(id)
      const index = partitionGroups.value.findIndex(group => group.id === id)
      if (index !== -1) {
        partitionGroups.value.splice(index, 1)
      }
    } catch {
      throw new Error('パーティショングループの削除に失敗しました')
    }
  }

  const resetDetail = () => {
    currentPartitionGroup.value = undefined
    editedValue.value = createDefaultPartitionGroupSeed()
  }

  return {
    partitionGroups,
    isPartitionGroupFetched,
    currentPartitionGroup,
    editedValue,
    partitionGroupOptions,
    canEditPartitionGroup,
    partitionGroupIdNameToMap,
    fetchPartitionGroups,
    fetchPartitionGroup,
    createPartitionGroup,
    editPartitionGroup,
    deletePartitionGroup,
    resetDetail
  }
})

export const usePartitionGroupStore = () => {
  const store = createPartitionGroupStore()
  const refs = storeToRefs(store)

  return {
    ...refs,
    fetchPartitionGroups: store.fetchPartitionGroups,
    fetchPartitionGroup: store.fetchPartitionGroup,
    createPartitionGroup: store.createPartitionGroup,
    editPartitionGroup: store.editPartitionGroup,
    deletePartitionGroup: store.deletePartitionGroup,
    resetDetail: store.resetDetail
  }
}

export type PartitionGroupStore = ReturnType<typeof usePartitionGroupStore>
