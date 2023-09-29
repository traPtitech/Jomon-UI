import { storeToRefs } from 'pinia'

import { useGroupStore } from '/@/stores/group'
import { useGroupDetailStore } from '/@/stores/groupDetail'

import type {
  GroupSeed,
  GroupSeedWithMemberAndOwners
} from '/@/features/group/model'
import { useGroupRepository } from '/@/features/group/repository'

export const useFetchGroupsUsecase = async () => {
  const repository = useGroupRepository()
  const { groups, isGroupFetched } = storeToRefs(useGroupStore())

  try {
    groups.value = await repository.fetchGroups()
    isGroupFetched.value = true
  } catch {
    throw new Error('グループ一覧の取得に失敗しました')
  }
}

export const useFetchGroup = async (id: string) => {
  const repository = useGroupRepository()
  const { group, editedValue } = storeToRefs(useGroupDetailStore())

  try {
    group.value = await repository.fetchGroup(id)
    editedValue.value = {
      name: group.value.name,
      description: group.value.description,
      budget: group.value.budget
    }
  } catch {
    throw new Error('グループの取得に失敗しました')
  }
}

export const createGroupUsecase = async (
  group: GroupSeedWithMemberAndOwners
) => {
  const repository = useGroupRepository()
  const { groups } = storeToRefs(useGroupStore())

  if (group.owners.length === 0) {
    throw new Error('グループオーナーは必須です')
  }

  try {
    const res = await repository.createGroup(group)
    groups.value.unshift(res)

    try {
      await Promise.all([
        addGroupMembersUsecase(res.id, group.members),
        addGroupOwnersUsecase(res.id, group.owners)
      ])
    } catch {
      throw new Error('グループの作成に失敗しました')
    }
  } catch {
    throw new Error('グループの作成に失敗しました')
  }
}

export const editGroupUsecase = async (id: string, groupSeed: GroupSeed) => {
  const repository = useGroupRepository()
  const { group, editedValue } = storeToRefs(useGroupDetailStore())
  if (!group.value) return

  try {
    const res = await repository.editGroup(id, groupSeed)
    group.value = {
      ...res,
      members: group.value.members,
      owners: group.value.owners
    }
  } catch {
    editedValue.value = {
      name: group.value.name,
      description: group.value.description,
      budget: group.value.budget ?? 0
    }
    throw new Error('グループの更新に失敗しました')
  }
}

export const deleteGroupUsecase = async (id: string) => {
  const repository = useGroupRepository()
  const { groups } = storeToRefs(useGroupStore())

  try {
    await repository.deleteGroup(id)
    groups.value = groups.value.filter(group => group.id !== id)
  } catch {
    throw new Error('グループの削除に失敗しました')
  }
}

export const addGroupMembersUsecase = async (id: string, members: string[]) => {
  const repository = useGroupRepository()
  const { group } = storeToRefs(useGroupDetailStore())
  if (!group.value) return

  try {
    const res = await repository.postGroupMembers(id, members)
    group.value = {
      ...group.value,
      members: [...group.value.members, ...res]
    }
  } catch {
    throw new Error('グループメンバーの追加に失敗しました')
  }
}

export const removeGroupMembersUsecase = async (
  id: string,
  members: string[]
) => {
  const repository = useGroupRepository()
  const { group } = storeToRefs(useGroupDetailStore())
  if (!group.value) return

  try {
    await repository.deleteGroupMembers(id, members)
    group.value = {
      ...group.value,
      members: group.value.members.filter(member => !members.includes(member))
    }
  } catch {
    throw new Error('グループメンバーの削除に失敗しました')
  }
}

export const addGroupOwnersUsecase = async (id: string, owners: string[]) => {
  const repository = useGroupRepository()
  const { group } = storeToRefs(useGroupDetailStore())
  if (!group.value) return

  try {
    const res = await repository.postGroupOwners(id, owners)
    group.value = {
      ...group.value,
      owners: [...group.value.owners, ...res]
    }
  } catch {
    throw new Error('グループオーナーの追加に失敗しました')
  }
}

export const removeGroupOwnersUsecase = async (
  id: string,
  owners: string[]
) => {
  const repository = useGroupRepository()
  const { group } = storeToRefs(useGroupDetailStore())
  if (!group.value) return

  try {
    await repository.deleteGroupOwners(id, owners)
    group.value = {
      ...group.value,
      owners: group.value.owners.filter(owner => !owners.includes(owner))
    }
  } catch {
    throw new Error('グループオーナーの削除に失敗しました')
  }
}
