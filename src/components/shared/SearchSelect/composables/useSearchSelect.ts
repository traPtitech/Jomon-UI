import type { Ref } from 'vue'
import { computed, ref } from 'vue'

import type { SearchSelectOption } from '../types'
import { safeString } from '../utils'

export function useSearchSelect<T extends string | number>(
  options: Ref<SearchSelectOption<T>[]>,
  filterFunction?: (option: SearchSelectOption<T>, query: string) => boolean
) {
  const searchTerm = ref('')

  const optionMap = computed(() => {
    const map = new Map<string | number, SearchSelectOption<T>>()
    options.value.forEach(option => {
      map.set(option.key, option)
    })
    return map
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

  const getLabel = (val: unknown): string => {
    if (val === null || val === undefined) return ''
    if (typeof val === 'string' || typeof val === 'number') {
      return optionMap.value.get(val)?.label ?? safeString(val)
    }
    return ''
  }

  return {
    searchTerm,
    filteredOptions,
    getLabel,
  }
}
