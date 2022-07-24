import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Group } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>(
    Array(1000).fill({
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'SysAd',
      description: 'SysAd班',
      budget: 250000,
      created_at: '2022-04-05T14:02:15.431Z',
      updated_at: '2022-04-05T14:02:15.431Z'
    })
  )
  const isGroupFetched = ref(false)

  const fetchGroups = async () => {
    try {
      groups.value = (await apis.getGroups()).data
      isGroupFetched.value = true
    } catch (err: any) {
      alert(err.message)
    }
  }
  const postGroupMember = async (id: string, members: string[]) => {
    try {
      await apis.postGroupMembers(id, members)
    } catch (err: any) {
      alert(err.message)
    }
  }
  const postGroupOwner = async (id: string, owners: string[]) => {
    try {
      await apis.postGroupOwners(id, owners)
    } catch (err: any) {
      alert(err.message)
    }
  }
  const deleteGroupMember = async (id: string, members: string[]) => {
    try {
      await apis.deleteGroupMembers(id, members)
    } catch (err: any) {
      alert(err.message)
    }
  }
  const deleteGroupOwner = async (id: string, owners: string[]) => {
    try {
      await apis.deleteGroupOwners(id, owners)
    } catch (err: any) {
      alert(err.message)
    }
  }

  return {
    groups,
    isGroupFetched,
    fetchGroups,
    postGroupOwner,
    postGroupMember,
    deleteGroupMember,
    deleteGroupOwner
  }
})
