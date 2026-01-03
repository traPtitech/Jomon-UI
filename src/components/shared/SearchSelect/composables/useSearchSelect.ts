import type { Ref } from 'vue'
import { computed, ref } from 'vue'

import type { SearchSelectOption } from '../types'

export function useSearchSelect<T extends string | number>(
  options: Ref<SearchSelectOption<T>[]>,
  model: Ref<T | T[] | null>,
  filterFunction?: (option: SearchSelectOption<T>, query: string) => boolean
) {
  const searchTerm = ref('')

  const optionMap = computed(() => {
    const map = new Map<T, SearchSelectOption<T>>()
    options.value.forEach(option => {
      map.set(option.key, option)
    })
    return map
  })

  const hasValue = computed(() => {
    const val = model.value
    if (Array.isArray(val)) {
      return val.length > 0
    }
    return val !== null && val !== ''
  })

  const filteredOptions = computed(() => {
    const query = searchTerm.value.toLowerCase()
    if (query === '') {
      return options.value
    }
    if (filterFunction) {
      return options.value.filter(option => filterFunction(option, query))
    }
    return options.value.filter(option =>
      option.label.toLowerCase().includes(query)
    )
  })

  const getLabel = (val: T | null | undefined): string => {
    if (val === null || val === undefined) return ''
    return optionMap.value.get(val)?.label ?? String(val)
  }

  return {
    searchTerm,
    hasValue,
    filteredOptions,
    getLabel,
  }
}
