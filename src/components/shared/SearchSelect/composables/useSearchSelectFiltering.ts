import { type MaybeRefOrGetter, type Ref, computed, toValue } from 'vue'

import { serializeOptionKey } from '@/components/shared/utils'

import type { Option } from '../types'

export function useSearchSelectFiltering<T extends string | number>(
  options: MaybeRefOrGetter<readonly Option<T>[]>,
  query: Ref<string>,
  filterFunction?: (option: Option<T>, term: string) => boolean
) {
  return computed(() => {
    const searchTerm = (query.value || '').trim()
    const rawOpts = toValue(options)
    const opts = Array.isArray(rawOpts) ? rawOpts : []
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

    const lowerTerm = searchTerm.toLocaleLowerCase('ja')
    return opts.filter(
      opt =>
        opt.label.toLocaleLowerCase('ja').includes(lowerTerm) ||
        serializeOptionKey(opt.key).toLocaleLowerCase('ja').includes(lowerTerm)
    )
  })
}
