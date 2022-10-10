import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { Group } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupStore = defineStore('group', () => {
  const toast = useToast()

  const groups = ref<Group[]>()
  const isGroupFetched = ref(false)

  const groupOptions = computed(() => {
    return (
      groups.value?.map(group => {
        return {
          key: group.name,
          value: group.id
        }
      }) ?? []
    )
  })

  const fetchGroups = async () => {
    try {
      groups.value = (await apis.getGroups()).data
      isGroupFetched.value = true
    } catch {
      toast.error('グループの取得に失敗しました')
    }
  }

  return {
    groups,
    groupOptions,
    isGroupFetched,
    fetchGroups
  }
})
