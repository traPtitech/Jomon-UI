import { ref } from 'vue'

import type { PartitionSeed } from '/@/features/partiton/model'

export const useNewPartiton = () => {
  const isSending = ref(false)

  const partiton = ref<PartitionSeed>({
    name: '',
    budget: 0,
    management: {
      category: 'manual',
      state: 'available'
    }
  })

  return { isSending, partiton }
}
