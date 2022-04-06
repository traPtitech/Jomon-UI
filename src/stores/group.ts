import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { Group, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([
    {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'SysAd',
      description: 'SysAd班',
      budget: 250000,
      created_at: '2022-04-05T14:02:15.431Z',
      updated_at: '2022-04-05T14:02:15.431Z'
    }
  ])
  const group = ref<Group>({})
  const groupMembers = ref<string[]>([])
  const groupOwners = ref<string[]>([])
  const isGroupFetched = ref<boolean>(false)
  const groupsLength = computed(() => {
    return groups.value.length
  })

  const groupsFilter = (index: number) => {
    return omitGroupDescription.value.slice((index - 1) * 10, index * 10)
  }
  const omitGroupDescription = computed(() => {
    const returnGroups: Group[] = groups.value
    for (let i = 0; i < groups.value.length; i++) {
      if (returnGroups[i].description!.length > 100) {
        returnGroups[i].description =
          returnGroups[i].description!.slice(0, 100) + '...'
      }
    }
    return returnGroups
  })

  const fetchGroups = async () => {
    groups.value = (await apis.groupsGet()).data.groups!
  }
  const postGroup = async (group: PostGroup) => {
    return (await apis.groupsPost(group)).data
  }
  const putGroup = async (group: PostGroup, id: string) => {
    await apis.groupsGroupIDPut(id, group)
  }
  const deleteGroup = async (id: string) => {
    await apis.groupsGroupIDDelete(id)
  }
  const fetchGroupMembers = async (id: string) => {
    groupMembers.value = (await apis.groupsGroupIDMembersGet(id)).data.members!
  }
  const fetchGroupOwners = async (id: string) => {
    groupOwners.value = (await apis.groupsGroupIDOwnersGet(id)).data.owners!
  }
  const postGroupOwner = async (id: string, owner: string) => {
    await apis.groupsGroupIDOwnersPost(id, { id: owner })
  }
  const postGroupMember = async (id: string, member: string) => {
    await apis.groupsGroupIDMembersPost(id, { id: member })
  }
  const deleteGroupMember = async (id: string, member: string) => {
    await apis.groupsGroupIDMembersMemberIDDelete(id, member)
  }
  const deleteGroupOwner = async (id: string, owner: string) => {
    await apis.groupsGroupIDOwnersOwnerIDDelete(id, owner)
  }

  return {
    groups,
    group,
    groupMembers,
    groupOwners,
    groupsLength,
    isGroupFetched,
    groupsFilter,
    fetchGroups,
    postGroup,
    putGroup,
    deleteGroup,
    fetchGroupMembers,
    fetchGroupOwners,
    postGroupOwner,
    postGroupMember,
    deleteGroupMember,
    deleteGroupOwner
  }
})
