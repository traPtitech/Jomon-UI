import { PartitionGroupRepositoryKey } from '@/di'
import type {
  PartitionGroup,
  PartitionGroupSeed
} from '@/features/partitionGroup/entities'
import type { User } from '@/features/user/entities'
import { defineStoreComposable } from '@/lib/store'
import type { AsyncStatus } from '@/types'
import { computed, inject, ref } from 'vue'

const createDefaultPartitionGroupSeed = (): PartitionGroupSeed => ({
  name: '',
  parentPartitionGroupId: null,
  depth: 0
})

export const usePartitionGroupStore = defineStoreComposable(
  'partitionGroup',
  () => {
    const repository = inject(PartitionGroupRepositoryKey)
    if (!repository) throw new Error('PartitionGroupRepository is not provided')

    const partitionGroups = ref<PartitionGroup[]>([])
    const status = ref<AsyncStatus>('idle')
    const error = ref<string | null>(null)
    const currentPartitionGroup = ref<PartitionGroup | undefined>(undefined)
    const editedValue = ref<PartitionGroupSeed>(
      createDefaultPartitionGroupSeed()
    )

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

    const isPartitionGroupFetched = computed(() => status.value === 'success')

    const fetchPartitionGroups = async () => {
      status.value = 'loading'
      error.value = null

      try {
        partitionGroups.value = await repository.fetchPartitionGroups()
        status.value = 'success'
      } catch (e) {
        status.value = 'error'
        error.value =
          'パーティショングループ一覧の取得に失敗しました: ' +
          (e instanceof Error ? e.message : String(e))
        throw new Error(error.value)
      }
    }

    const fetchPartitionGroup = async (id: string) => {
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
      status,
      error,
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
  }
)

export type PartitionGroupStore = ReturnType<typeof usePartitionGroupStore>
