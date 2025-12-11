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
      try {
        return opts.filter(opt => filterFunction(opt, searchTerm))
      } catch (e) {
        console.error('Error in custom filterFunction:', e)
        // Fallback to returning original options or empty depending on preference.
        // Returning original options is safer to avoid empty list on error.
        return opts
      }
    }

    const lowerTerm = searchTerm.toLocaleLowerCase()
    return opts.filter(
      opt =>
        opt.label.toLocaleLowerCase().includes(lowerTerm) ||
        toString(opt.key).toLocaleLowerCase().includes(lowerTerm)
    )
  })
}
