import { ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { useSearchSelect } from '@/components/shared/SearchSelect/composables/useSearchSelect'
import type { SearchSelectOption } from '@/components/shared/SearchSelect/types'

describe('useSearchSelect', () => {
  const options = ref<SearchSelectOption<string>[]>([
    { key: 'opt1', label: 'Option 1' },
    { key: 'opt2', label: 'Option 2' },
    { key: 'other', label: 'Other Item' },
  ])

  describe('filteredOptions', () => {
    it('returns all options when search term is empty', () => {
      const { searchTerm, filteredOptions } = useSearchSelect(options)
      searchTerm.value = ''
      expect(filteredOptions.value).toHaveLength(3)
      expect(filteredOptions.value).toEqual(options.value)
    })

    it('filters options based on search term (default behavior)', () => {
      const { searchTerm, filteredOptions } = useSearchSelect(options)
      searchTerm.value = 'opt'
      expect(filteredOptions.value).toHaveLength(2)
      expect(filteredOptions.value.map(o => o.key)).toEqual(['opt1', 'opt2'])

      searchTerm.value = 'Item'
      expect(filteredOptions.value).toHaveLength(1)
      expect(filteredOptions.value[0]?.key).toBe('other')
    })

    it('is case-insensitive by default', () => {
      const { searchTerm, filteredOptions } = useSearchSelect(options)
      searchTerm.value = 'OPTION'
      expect(filteredOptions.value).toHaveLength(2)
    })

    it('uses custom filter function if provided', () => {
      const filterFn = (option: SearchSelectOption<string>, query: string) => {
        // Custom filter: exact match on key
        return option.key === query
      }
      const { searchTerm, filteredOptions } = useSearchSelect(options, filterFn)

      searchTerm.value = 'opt1'
      expect(filteredOptions.value).toHaveLength(1)
      expect(filteredOptions.value[0]?.label).toBe('Option 1')

      // Partial match should fail with this custom filter
      searchTerm.value = 'opt'
      expect(filteredOptions.value).toHaveLength(0)
    })
  })

  describe('getLabel', () => {
    it('returns label for existing key', () => {
      const { getLabel } = useSearchSelect(options)
      expect(getLabel('opt1')).toBe('Option 1')
    })

    it('returns empty string for null or undefined', () => {
      const { getLabel } = useSearchSelect(options)
      expect(getLabel(null)).toBe('')
      expect(getLabel(undefined)).toBe('')
    })

    it('returns safeString fallback for unknown key', () => {
      const { getLabel } = useSearchSelect(options)
      expect(getLabel('unknown-key')).toBe('unknown-key')
    })

    it('handles non-string/non-number types gracefully (fallback)', () => {
      const { getLabel } = useSearchSelect(options)
      // Simulating runtime edge case with invalid type
      expect(getLabel({})).toBe('')
      expect(getLabel(true)).toBe('')
    })

    it('handles number keys correctly', () => {
      const numberOptions = ref<SearchSelectOption<number>[]>([
        { key: 1, label: 'One' },
        { key: 2, label: 'Two' },
      ])
      const { getLabel } = useSearchSelect(numberOptions)
      expect(getLabel(1)).toBe('One')
      expect(getLabel(3)).toBe('3') // fallback
    })
  })
})
