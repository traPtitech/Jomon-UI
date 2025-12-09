import { type Ref, computed, ref, watch } from 'vue'

import { toString } from '@/components/shared/utils'

import type { Option } from '../types'

export const useSearchSelectHighlight = <T>(
  filteredOptions: Ref<Option<T>[]>,
  isOpen: Ref<boolean>,
  listboxId: string
) => {
  const highlightedIndex = ref(-1)

  const activeOptionId = computed(() => {
    if (highlightedIndex.value === -1) return undefined
    return `${listboxId}-option-${toString(highlightedIndex.value)}`
  })

  // Initialize highlightedIndex when menu opens or options change
  // Note: We respect the current highlightedIndex if it's already set (not -1) when opening,
  // unless the options have changed (handled by the other watcher).
  watch(isOpen, newVal => {
    if (!newVal) {
      highlightedIndex.value = -1
    } else if (filteredOptions.value.length > 0) {
      if (highlightedIndex.value === -1) {
        highlightedIndex.value = 0
      }
    } else {
      highlightedIndex.value = -1
    }
  })

  // Reset highlight when options change (e.g. typing)
  watch(filteredOptions, newVal => {
    if (!isOpen.value) {
      highlightedIndex.value = -1
      return
    }

    if (newVal.length > 0) {
      highlightedIndex.value = 0
    } else {
      highlightedIndex.value = -1
    }
  })

  return {
    highlightedIndex,
    activeOptionId,
  }
}
