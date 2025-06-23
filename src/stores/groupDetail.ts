import { computed, ref } from 'vue'

import type { Partition, PartitionSeed } from '/@/features/partiton/model'
import type { User } from '/@/features/user/model'
import { defineComposable } from '/@/lib/store'

export const usePartitonDetailStore = defineComposable('partitonDetail', () => {
  const partiton = ref<Partition>()

  const editedValue = ref<PartitionSeed>({
    name: '',
    budget: 0,
    management: {
      category: 'manual',
      state: 'available'
    }
  })
  const canEditPartiton = computed(() => (user: User | undefined) => {
    if (!user) return false
    return user.accountManager
  })

  return {
    partiton,
    editedValue,
    canEditPartiton
  }
})
