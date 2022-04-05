import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Group, PostGroup } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([])
  const group = ref<Group>({})
  const groupMembers = ref<string[]>([])
  const groupOwners = ref<string[]>([])
  const isGroupFetched = ref(false)

  const groupsLength = groups.value.length
  const groupsFilter = (index: number) => {
    return omitGroupDescription().slice((index - 1) * 10, index * 10)
  }
  const omitGroupDescription = () => {
    const returnGroups: Group[] = groups.value
    for (let i = 0; i < groups.value.length; i++) {
      if (returnGroups[i].description!.length > 100) {
        returnGroups[i].description =
          returnGroups[i].description!.slice(0, 100) + '...'
      }
    }
    return returnGroups
  }

  const fetchGroups = async () => {
    groups.value = (await apis.groupsGet()).data.groups!
  }
  const putGroup = async (group: PostGroup, id: string) => {
    await apis.groupsGroupIDPut(id, group)
  }
  const deleteGroup = async (id: string) => {
    await apis.groupsGroupIDDelete(id)
  }
  const fetchGroupMember = async (id: string) => {
    groupMembers.value = (await apis.groupsGroupIDMembersGet(id)).data.members!
  }
  const fetchGroupOwner = async (id: string) => {
    groupOwners.value = (await apis.groupsGroupIDOwnersGet(id)).data.owners!
  }
  const deleteGroupMember = async (id: string, member: string) => {
    await apis.groupsGroupIDMembersMemberIDDelete(id, member)
  }
  const deleteGroupOwner = async (id: string, member: string) => {
    await apis.groupsGroupIDOwnersOwnerIDDelete(id, member)
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
    putGroup,
    deleteGroup,
    fetchGroupMember,
    fetchGroupOwner,
    deleteGroupMember,
    deleteGroupOwner
  }
})
