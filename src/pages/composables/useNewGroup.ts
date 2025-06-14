import { ref } from 'vue'

import type { PartitionSeed } from '/@/features/group/model'

export const useNewGroup = () => {
  const isSending = ref(false)

  const group = ref<PartitionSeed>({
    name: '',
    budget: 0,
    management: {
      category: 'manual',
      state: 'available'
    }
  })

  return { isSending, group }
}
