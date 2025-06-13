import { computed, ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import type { GroupDetail } from '/@/features/group/model'
import type { User } from '/@/features/user/model'

export const useGroupDetailStore = defineComposable('groupDetail', () => {
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
