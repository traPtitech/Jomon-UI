import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Group } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>()
  const isGroupFetched = ref(false)

  const fetchGroups = async () => {
    try {
      groups.value = (await apis.getGroups()).data
      isGroupFetched.value = true
    } catch (err) {
      alert(err)
    }
  }

  return {
    groups,
    isGroupFetched,
    fetchGroups
  }
})
