import { ref } from 'vue'

import type { PartitionSeed } from '/@/features/partition/model'

export const useNewPartition = () => {
  const isSending = ref(false)

  const partition = ref<PartitionSeed>({
    name: '',
    budget: 0,
    management: {
      category: 'manual',
      state: 'available'
    }
  })

  return { isSending, partition }
}
