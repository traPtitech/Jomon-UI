import { type Ref, computed, ref } from 'vue'

import type { SearchSelectOption } from '../types'
import { safeString } from '../utils'

export function useSearchSelect<T extends string | number | null, U = T | T[]>(
  options: Ref<SearchSelectOption<NonNullable<T>>[]>,
  modelValue: Ref<U>,
  filterFunction?: (
    option: SearchSelectOption<NonNullable<T>>,
    query: string
  ) => boolean,
  openProp?: Ref<boolean>
) {
  const searchTerm = ref('')
  // open state should be synchronized from the component if provided
  const open = openProp ?? ref(false)
  const isFocused = ref(false)

  const contains = (text: string, query: string) => {
    return text.toLowerCase().includes(query.toLowerCase())
  }

  const hasValue = computed(() => {
    const v = modelValue.value
    return Array.isArray(v) ? v.length > 0 : v !== null
  })

  /**
   * Floating label logic:
   * Triggers when focused, menu is open, or a value exists.
   */
  const isFloating = computed(() => {
    return (
      isFocused.value || open.value || hasValue.value || searchTerm.value !== ''
    )
  })

  /**
   * Internal map for efficient lookups.
   * Keys are the option keys (strings or numbers).
   */
  const optionMap = computed(() => {
    const map = new Map<string | number, SearchSelectOption<NonNullable<T>>>()
    for (const opt of options.value) {
      map.set(opt.key, opt)
    }
    return map
  })

  /**
   * Type guard to check if a value exists in the options.
   * Narrowing to NonNullable<T> because keys are always non-null primitives.
   */
  const isTValue = (val: unknown): val is NonNullable<T> => {
    return (
      (typeof val === 'string' || typeof val === 'number') &&
      optionMap.value.has(val)
    )
  }

  const getOption = (
    val: unknown
  ): SearchSelectOption<NonNullable<T>> | undefined => {
    if (!isTValue(val)) return undefined
    // val is now narrowed to string | number and guaranteed to be in the map
    return optionMap.value.get(val)
  }

  const getLabel = (val: unknown): string => {
    const option = getOption(val)
    if (option) return option.label
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
