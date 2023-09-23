import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { GroupDetail } from '/@/features/group/model'
import type { User } from '/@/features/user/model'

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
