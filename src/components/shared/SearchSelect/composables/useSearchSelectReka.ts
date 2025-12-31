import { type Ref, computed, ref } from 'vue'

import type { Option } from '../types'
import { safeString } from '../utils'

type TValue = string | number

export function useSearchSelectReka(
  options: Ref<Option<TValue>[]>,
  modelValue: Ref<TValue | TValue[] | null>,
  filterFunction?: (option: Option<TValue>, query: string) => boolean
) {
  const searchTerm = ref('')
  const open = ref(false)
  const isFocused = ref(false)

  const hasValue = computed(() => {
    const v = modelValue.value
    return Array.isArray(v) ? v.length > 0 : v !== null
  })

  /**
   * Floating label logic (Refactored):
   * Should trigger when focused, menu is open, or a value exists.
   * We no longer rely on searchTerm here to ensure UI stability when the query is cleared.
   */
  const isFloating = computed(() => {
    return isFocused.value || open.value || hasValue.value
  })

  const optionMap = computed(() => {
    const map = new Map<TValue, Option<TValue>>()
    for (const opt of options.value) {
      map.set(opt.key, opt)
    }
    return map
  })

  const isTValue = (val: unknown): val is TValue => {
    return typeof val === 'string' || typeof val === 'number'
  }

  const getOption = (val: unknown): Option<TValue> | undefined => {
    if (isTValue(val)) {
      return optionMap.value.get(val)
    }
    return undefined
  }

  const getLabel = (val: unknown): string => {
    return getOption(val)?.label ?? (isTValue(val) ? safeString(val) : '')
  }

  const filteredOptions = computed(() => {
    if (searchTerm.value === '') return options.value

    const term = searchTerm.value.toLowerCase()
    if (filterFunction) {
      return options.value.filter(o => filterFunction(o, searchTerm.value))
    }
    return options.value.filter(o => o.label.toLowerCase().includes(term))
  })

  return {
    searchTerm,
    open,
    isFocused,
    isFloating,
    filteredOptions,
    optionMap,
    isTValue,
    getOption,
    getLabel,
  }
}
