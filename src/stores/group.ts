import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useToastStore } from '/@/stores/toast'

import type { Group } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupStore = defineStore('group', () => {
  const toastStore = useToastStore()

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
      toastStore.showToast({
        type: 'error',
        message: 'グループの取得に失敗しました'
      })
    }
  }

  return {
    groups,
    groupOptions,
    isGroupFetched,
    fetchGroups
  }
})
