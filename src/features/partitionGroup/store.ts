import { computed, inject, ref } from 'vue'

import { defineStoreComposable } from '@/lib/store'

import { PartitionGroupRepositoryKey } from '@/di'
import type {
  PartitionGroup,
  PartitionGroupSeed,
} from '@/features/partitionGroup/entities'
import type { User } from '@/features/user/entities'
import type { AsyncStatus } from '@/types'

export const usePartitionGroupStore = defineStoreComposable(
  'partitionGroup',
  () => {
    const repository = inject(PartitionGroupRepositoryKey)
    if (!repository) throw new Error('PartitionGroupRepository is not provided')

    const idToPartitionGroup = ref(new Map<string, PartitionGroup>())
    const status = ref<AsyncStatus>('idle')
    const error = ref<string | null>(null)

    const partitionGroups = computed(() =>
      Array.from(idToPartitionGroup.value.values())
    )

    const partitionGroupOptions = computed(() =>
      partitionGroups.value.map(group => ({
        key: group.name,
        value: group.id,
      }))
    )

    const canEditPartitionGroup = computed(() => (user: User | undefined) => {
      if (!user) return false
      return user.accountManager
    })

    const isPartitionGroupFetched = computed(() => status.value === 'success')

    const fetchPartitionGroups = async () => {
      status.value = 'loading'
      error.value = null

      try {
        const partitionGroups = await repository.fetchPartitionGroups()
        idToPartitionGroup.value = new Map(
          partitionGroups.map(group => [group.id, group])
        )
        status.value = 'success'
      } catch (e) {
        status.value = 'error'
        error.value =
          'パーティショングループ一覧の取得に失敗しました: ' +
          (e instanceof Error ? e.message : String(e))
        throw new Error(error.value, { cause: e })
      }
    }

    const fetchPartitionGroup = async (id: string) => {
      try {
        return await repository.fetchPartitionGroup(id)
      } catch {
        throw new Error('パーティショングループの取得に失敗しました')
      }
    }

    const createPartitionGroup = async (partitionGroup: PartitionGroupSeed) => {
      try {
        const createdPartitionGroup =
          await repository.createPartitionGroup(partitionGroup)
        idToPartitionGroup.value.set(
          createdPartitionGroup.id,
          createdPartitionGroup
        )
      } catch {
        throw new Error('パーティショングループの作成に失敗しました')
      }
    }

    const editPartitionGroup = async (
      id: string,
      partitionGroupSeed: PartitionGroupSeed
    ) => {
      try {
        const editedPartitionGroup = await repository.editPartitionGroup(
          id,
          partitionGroupSeed
        )
        idToPartitionGroup.value.set(
          editedPartitionGroup.id,
          editedPartitionGroup
        )
      } catch {
        throw new Error('パーティショングループの更新に失敗しました')
      }
    }

    const deletePartitionGroup = async (id: string) => {
      try {
        await repository.deletePartitionGroup(id)
        idToPartitionGroup.value.delete(id)
      } catch {
        throw new Error('パーティショングループの削除に失敗しました')
      }
    }

    return {
      idToPartitionGroup,
      partitionGroups,
      status,
      error,
      isPartitionGroupFetched,
      partitionGroupOptions,
      canEditPartitionGroup,
      fetchPartitionGroups,
      fetchPartitionGroup,
      createPartitionGroup,
      editPartitionGroup,
      deletePartitionGroup,
    }
  }
)

export type PartitionGroupStore = ReturnType<typeof usePartitionGroupStore>
