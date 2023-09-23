import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { User } from '/@/lib/apis'

import type { GroupDetail } from '/@/features/group/model'

export const useGroupDetailStore = defineStore('groupDetail', () => {
  const group = ref<GroupDetail>()

  const editedValue = ref({
    name: '',
    description: '',
    budget: 0
  })
  const canEditGroup = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.admin || group.value?.owners.includes(user.id)
  })

  return {
    group,
    editedValue,
    canEditGroup
  }
})
