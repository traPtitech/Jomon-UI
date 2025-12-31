import { ref } from 'vue'

import { describe, expect, it } from 'vitest'

import type { RekaOption } from '@/components/shared/SearchSelect/composables/useSearchSelect'
import { useSearchSelect } from '@/components/shared/SearchSelect/composables/useSearchSelect'

type TestValue = string | number

describe('useSearchSelect', () => {
  const options = ref<RekaOption<TestValue>[]>([
    { id: 1, key: 'opt1', label: 'Option 1' },
    { id: 2, key: 'opt2', label: 'Option 2' },
    { id: 3, key: 0, label: 'Option Zero' },
    { id: 4, key: 'opt4', label: 'Disabled Option', disabled: true },
  ])

  it('filters options based on searchTerm', () => {
    const model = ref<TestValue | null>(null)
    const { searchTerm, filteredOptions } = useSearchSelect(options, model)

    searchTerm.value = 'option 1'
    expect(filteredOptions.value).toHaveLength(1)
    expect(filteredOptions.value[0]?.key).toBe('opt1')

    searchTerm.value = 'zero'
    expect(filteredOptions.value).toHaveLength(1)
    expect(filteredOptions.value[0]?.key).toBe(0)
  })

  it('uses custom filter function if provided', () => {
    const model = ref<TestValue | null>(null)
    const customFilter = (opt: RekaOption<TestValue>, query: string) =>
      opt.label.includes(query)
    const { searchTerm, filteredOptions } = useSearchSelect(
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
      const model = ref<TestValue | null>(null)
      const { isFocused, open, isFloating } = useSearchSelect(options, model)

      expect(isFloating.value).toBe(false)

      isFocused.value = true
      expect(isFloating.value).toBe(true)

      isFocused.value = false
      open.value = true
      expect(isFloating.value).toBe(true)
    })

    it('returns true if value is selected (even if blurred/closed)', () => {
      const model = ref<TestValue | null>('opt1')
      const { isFloating } = useSearchSelect(options, model)
      expect(isFloating.value).toBe(true)

      const multiModel = ref<TestValue[]>(['opt1'])
      const { isFloating: isMultiFloating } = useSearchSelect(
        options,
        multiModel
      )
      expect(isMultiFloating.value).toBe(true)
    })

    it('handles falsy values correctly (0 should be considered a value)', () => {
      const model = ref<TestValue | null>(0)
      const { isFloating } = useSearchSelect(options, model)
      expect(isFloating.value).toBe(true)
    })

    it('stays true even if searchTerm is cleared but open', () => {
      const model = ref<TestValue | null>(null)
      const { open, searchTerm, isFloating } = useSearchSelect(options, model)

      open.value = true
      searchTerm.value = ''
      expect(isFloating.value).toBe(true)
    })
  })

  describe('label and option lookups', () => {
    it('gets correct label for keys', () => {
      const model = ref<TestValue | null>(null)
      const { getLabel } = useSearchSelect(options, model)

      expect(getLabel('opt1')).toBe('Option 1')
      expect(getLabel(0)).toBe('Option Zero')
      expect(getLabel('unknown')).toBe('unknown') // Should return key string if it's a primitive
    })

    it('identifies valid values (presence in options)', () => {
      const model = ref<TestValue | null>(null)
      const { isTValue } = useSearchSelect(options, model)

      expect(isTValue('opt1')).toBe(true)
      expect(isTValue(0)).toBe(true)
      expect(isTValue('unknown')).toBe(false)
      expect(isTValue(null)).toBe(false)
      expect(isTValue(undefined)).toBe(false)
    })
  })
})
