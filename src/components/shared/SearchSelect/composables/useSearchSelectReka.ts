import { computed, ref } from 'vue'
import type { Ref } from 'vue'

import type { Option } from '../types'

export function useSearchSelectReka<TValue extends string | number>(
  options: Ref<Option<TValue>[]>,
  modelValue: Ref<TValue | null | TValue[]>,
  filterFunction?: (option: Option<TValue>, query: string) => boolean
) {
  const searchTerm = ref('')
  const open = ref(false)
  const isFocused = ref(false)

  // Performance optimization: O(1) lookups
  const optionMap = computed(() => new Map(options.value.map(o => [o.key, o])))
  // Use Set<unknown> to allow checking mixed types without casting or generic constraints issues
  const keySet = computed(() => new Set<unknown>(options.value.map(o => o.key)))

  const isFloating = computed(() => {
    const hasValue = Array.isArray(modelValue.value)
      ? modelValue.value.length > 0
      : modelValue.value !== null
    return isFocused.value || searchTerm.value.length > 0 || hasValue
  })

  const filteredOptions = computed(() => {
    if (searchTerm.value === '') return options.value

    const term = searchTerm.value.toLowerCase()
    if (filterFunction) {
      return options.value.filter(o => filterFunction(o, searchTerm.value))
    }
    return options.value.filter(o => o.label.toLowerCase().includes(term))
  })

  /**
   * Type Guard: Verifies that the value is a string or number AND exists in the options.
   */
  function isTValue(val: unknown): val is TValue {
    return (
      (typeof val === 'string' || typeof val === 'number') &&
      keySet.value.has(val)
    )
  }

  function getLabel(key: TValue): string {
    return optionMap.value.get(key)?.label ?? String(key)
  }

  return {
    searchTerm,
    open,
    isFocused,
    isFloating,
    filteredOptions,
    optionMap,
    keySet,
    isTValue,
    getLabel,
  }
}
