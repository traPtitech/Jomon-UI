import { type MaybeRefOrGetter, type Ref, computed, toValue } from 'vue'

import { toString } from '@/components/shared/utils'

import type { Option } from '../types'

export function useSearchSelectFiltering<T extends string | number>(
  options: MaybeRefOrGetter<Option<T>[]>,
  query: Ref<string>,
  filterFunction?: (option: Option<T>, term: string) => boolean
) {
  return computed(() => {
    const searchTerm = query.value.trim()
    const opts = toValue(options)
    if (!searchTerm) return opts

    if (filterFunction) {
      return opts.filter(opt => filterFunction(opt, searchTerm))
    }

    const lowerTerm = searchTerm.toLowerCase()
    return opts.filter(
      opt =>
        opt.label.toLowerCase().includes(lowerTerm) ||
        toString(opt.key).toLowerCase().includes(lowerTerm)
    )
  })
}
