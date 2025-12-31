import { type Ref, computed, ref } from 'vue'

import { type AcceptableValue, useFilter } from 'reka-ui'

import { safeString } from '../utils'

/**
 * Localized Option type for Reka components.
 * Key must be a primitive (string or number) to ensure safe Map lookups.
 */
export interface SearchSelectOption<T extends string | number> {
  key: T
  label: string
  disabled?: boolean
}

export function useSearchSelect<T extends string | number | null, U = T | T[]>(
  options: Ref<SearchSelectOption<NonNullable<T>>[]>,
  modelValue: Ref<U>,
  filterFunction?: (
    option: SearchSelectOption<NonNullable<T>>,
    query: string
  ) => boolean
) {
  const searchTerm = ref('')
  const open = ref(false)
  const isFocused = ref(false)
  const { contains } = useFilter({ sensitivity: 'base' })

  const hasValue = computed(() => {
    const v = modelValue.value
    return Array.isArray(v) ? v.length > 0 : v !== null
  })

  /**
   * Floating label logic:
   * Triggers when focused, menu is open, or a value exists.
   */
  const isFloating = computed(() => {
    return isFocused.value || open.value || hasValue.value
  })

  const optionMap = computed(() => {
    const map = new Map<unknown, SearchSelectOption<NonNullable<T>>>()
    for (const opt of options.value) {
      map.set(opt.key, opt)
    }
    return map
  })

  /**
   * Type guard to check if a value exists in the options and matches T.
   */
  const isTValue = (val: unknown): val is T => {
    // Check if the value exists as a key in our map to ensure it's a valid option
    return val !== null && val !== undefined && optionMap.value.has(val)
  }

  const getOption = (
    val: unknown
  ): SearchSelectOption<NonNullable<T>> | undefined => {
    if (val === null || val === undefined) return undefined
    return optionMap.value.get(val)
  }

  const getLabel = (val: unknown): string => {
    const option = getOption(val)
    if (option) return option.label
    // Fallback to safe stringification for basic types
    if (typeof val === 'string' || typeof val === 'number')
      return safeString(val)
    return ''
  }

  const filteredOptions = computed(() => {
    if (searchTerm.value === '') return options.value

    if (filterFunction) {
      return options.value.filter(o => filterFunction(o, searchTerm.value))
    }
    return options.value.filter(o => contains(o.label, searchTerm.value))
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

export type { AcceptableValue }
