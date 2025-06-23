import { computed, ref } from 'vue'
import type { Partition } from '/@/features/partiton/model'
import { defineComposable } from '/@/lib/store'

export const usePartitonStore = defineComposable('partiton', () => {
  const partitons = ref<Partition[]>([])

  const isPartitonFetched = ref(false)

  const partitonOptions = computed(() =>
    partitons.value.map(partiton => ({
      key: partiton.name,
      value: partiton.id
    }))
  )

  return {
    partitons,
    partitonOptions,
    isPartitonFetched
  }
})
