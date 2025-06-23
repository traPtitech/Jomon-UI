import { computed, ref } from 'vue'

import type { Partition, PartitionSeed } from '/@/features/partition/model'
import type { User } from '/@/features/user/model'
import { defineComposable } from '/@/lib/store'

export const usePartitionDetailStore = defineComposable(
  'partitionDetail',
  () => {
    const partition = ref<Partition>()

    const editedValue = ref<PartitionSeed>({
      name: '',
      budget: 0,
      management: {
        category: 'manual',
        state: 'available'
      }
    })
    const canEditPartition = computed(() => (user: User | undefined) => {
      if (!user) return false
      return user.accountManager
    })

    return {
      partition,
      editedValue,
      canEditPartition
    }
  }
)
