import { computed, ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import type { Partition } from '/@/features/group/model'

export const useGroupStore = defineComposable('group', () => {
  const groups = ref<Partition[]>([])

  const isGroupFetched = ref(false)

  const groupOptions = computed(() =>
    groups.value.map(group => ({
      key: group.name,
      value: group.id
    }))
  )

  return {
    groups,
    groupOptions,
    isGroupFetched
  }
})
