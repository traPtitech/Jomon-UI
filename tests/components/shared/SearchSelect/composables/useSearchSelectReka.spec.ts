import { ref } from 'vue'

import { describe, expect, it } from 'vitest'

import { useSearchSelectReka } from '@/components/shared/SearchSelect/composables/useSearchSelectReka'
import type { Option } from '@/components/shared/SearchSelect/types'

describe('useSearchSelectReka', () => {
  const options = ref([
    { key: 'opt1', label: 'Option 1' },
    { key: 'opt2', label: 'Option 2' },
    { key: 0, label: 'Option Zero' },
    { key: 'opt4', label: 'Disabled Option', disabled: true },
  ])

  it('filters options based on searchTerm', () => {
    const model = ref<string | number | null>(null)
    const { searchTerm, filteredOptions } = useSearchSelectReka(options, model)

    searchTerm.value = 'option 1'
    expect(filteredOptions.value).toHaveLength(1)
    expect(filteredOptions.value[0]?.key).toBe('opt1')

    searchTerm.value = 'zero'
    expect(filteredOptions.value).toHaveLength(1)
    expect(filteredOptions.value[0]?.key).toBe(0)
  })

  it('uses custom filter function if provided', () => {
    const model = ref<string | number | null>(null)
    const customFilter = (opt: Option<string | number>, query: string) =>
      opt.label.includes(query)
    const { searchTerm, filteredOptions } = useSearchSelectReka(
      options,
      model,
      customFilter
    )

    searchTerm.value = 'Option'
    expect(filteredOptions.value).toHaveLength(4)

    searchTerm.value = 'Disabled'
    expect(filteredOptions.value).toHaveLength(1)

    searchTerm.value = ''
    expect(filteredOptions.value).toHaveLength(4)
  })

  describe('isFloating logic', () => {
    it('returns true if focused or open', () => {
      const model = ref<string | number | null>(null)
      const { isFocused, open, isFloating } = useSearchSelectReka(
        options,
        model
      )

      expect(isFloating.value).toBe(false)

      isFocused.value = true
      expect(isFloating.value).toBe(true)

      isFocused.value = false
      open.value = true
      expect(isFloating.value).toBe(true)
    })

    it('returns true if value is selected (even if blurred/closed)', () => {
      const model = ref<string | number | null>('opt1')
      const { isFloating } = useSearchSelectReka(options, model)
      expect(isFloating.value).toBe(true)

      const multiModel = ref(['opt1'])
      const { isFloating: isMultiFloating } = useSearchSelectReka(
        options,
        multiModel
      )
      expect(isMultiFloating.value).toBe(true)
    })

    it('handles falsy values correctly (0 should be considered a value)', () => {
      const model = ref<string | number | null>(0)
      const { isFloating } = useSearchSelectReka(options, model)
      expect(isFloating.value).toBe(true)
    })

    it('stays true even if searchTerm is cleared but open', () => {
      const model = ref<string | number | null>(null)
      const { open, searchTerm, isFloating } = useSearchSelectReka(
        options,
        model
      )

      open.value = true
      searchTerm.value = ''
      expect(isFloating.value).toBe(true)
    })
  })

  describe('label and option lookups', () => {
    it('gets correct label for keys', () => {
      const model = ref<string | number | null>(null)
      const { getLabel } = useSearchSelectReka(options, model)

      expect(getLabel('opt1')).toBe('Option 1')
      expect(getLabel(0)).toBe('Option Zero')
      expect(getLabel('unknown')).toBe('unknown') // fallback to key string
    })

    it('identifies valid TValue', () => {
      const model = ref<string | number | null>(null)
      const { isTValue } = useSearchSelectReka(options, model)

      expect(isTValue('abc')).toBe(true)
      expect(isTValue(123)).toBe(true)
      expect(isTValue(null)).toBe(false)
      expect(isTValue(undefined)).toBe(false)
      expect(isTValue({})).toBe(false)
    })
  })
})
