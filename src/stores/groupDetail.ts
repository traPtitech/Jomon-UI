import { computed, ref } from 'vue'

import { defineComposable } from '/@/lib/store'
import type { Partition, PartitionSeed } from '/@/features/group/model'
import type { User } from '/@/features/user/model'

export const useGroupDetailStore = defineComposable('groupDetail', () => {
  const group = ref<Partition>()

  const editedValue = ref<PartitionSeed>({
    name: '',
    budget: 0,
    management: {
      category: 'manual',
      state: 'available'
    }
  })
  const canEditGroup = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.accountManager
  })

  return {
    group,
    editedValue,
    canEditGroup
  }
})
