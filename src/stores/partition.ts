import { computed, ref } from 'vue'
import type { Partition } from '/@/features/partition/model'
import { defineComposable } from '/@/lib/store'

export const usePartitionStore = defineComposable('partition', () => {
  const partitions = ref<Partition[]>([])

  const isPartitionFetched = ref(false)

  const partitionOptions = computed(() =>
    partitions.value.map(partition => ({
      key: partition.name,
      value: partition.id
    }))
  )

  return {
    partitions,
    partitionOptions,
    isPartitionFetched
  }
})
