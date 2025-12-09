import { defineComponent, h, reactive, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { type SearchSelectCommonProps } from '@/components/shared/SearchSelect/composables/useSearchSelectBase'
import { useSearchSelectMulti } from '@/components/shared/SearchSelect/composables/useSearchSelectMulti'

const defaultProps: SearchSelectCommonProps<string> = {
  options: [
    { label: 'Option 1', key: 'opt1' },
    { label: 'Option 2', key: 'opt2' },
    { label: 'Other', key: 'other' },
  ],
  label: 'Test Label',
}

describe('useSearchSelectMulti', () => {
  const createWrapper = (
    initialProps: SearchSelectCommonProps<string> = defaultProps,
    initialValue: string[] = []
  ) => {
    let composable!: ReturnType<typeof useSearchSelectMulti<string>>
    const emit = vi.fn()
    const modelValue = ref(initialValue)
    const dropdownRef = ref<HTMLElement | null>(null)
    const inputRef = ref({ focus: vi.fn(), select: vi.fn() })
    const props = reactive(initialProps)

    const TestComponent = defineComponent({
      setup() {
        composable = useSearchSelectMulti<string>(
          props,
          emit,
          modelValue,
          dropdownRef,
          inputRef
        )
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)
    return { composable, emit, modelValue, wrapper, inputRef }
  }

  it('does not sync search term from modelValue', () => {
    const { composable } = createWrapper(defaultProps, ['opt1'])
    expect(composable.searchTerm.value).toBe('')
  })

  it('filters options based on search term', () => {
    const { composable } = createWrapper()
    composable.isOpen.value = true
    composable.searchTerm.value = 'opt'
    expect(composable.filteredOptions.value).toHaveLength(2)
  })

  it('toggles selection on click/enter', () => {
    const { composable, modelValue } = createWrapper()

    // Select
    composable.handleSelect('opt1')
    expect(modelValue.value).toEqual(['opt1'])

    // Deselect
    composable.handleSelect('opt1')
    expect(modelValue.value).toEqual([])
  })

  it('handles Backspace to remove last item', () => {
    const { composable, modelValue } = createWrapper(defaultProps, [
      'opt1',
      'opt2',
    ])

    // Backspace with empty search term
    composable.searchTerm.value = ''
    const backspace = new KeyboardEvent('keydown', { key: 'Backspace' })

    composable.handleKeyDown(backspace)
    expect(modelValue.value).toEqual(['opt1']) // Removed opt2 (last item)

    composable.handleKeyDown(backspace)
    expect(modelValue.value).toEqual([]) // Removed opt1
  })

  it('does not remove item on Backspace if search term is not empty', () => {
    const { composable, modelValue } = createWrapper(defaultProps, ['opt1'])

    composable.searchTerm.value = 'a'
    const backspace = new KeyboardEvent('keydown', { key: 'Backspace' })

    composable.handleKeyDown(backspace)
    expect(modelValue.value).toEqual(['opt1'])
  })

  it('resets search term on close (resetOnClose=true by default)', async () => {
    const { composable } = createWrapper()
    composable.isOpen.value = true
    composable.searchTerm.value = 'search'

    // Force transition
    await new Promise(resolve => setTimeout(resolve, 10))

    const escape = new KeyboardEvent('keydown', { key: 'Escape' })

    composable.handleKeyDown(escape)
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(composable.isOpen.value).toBe(false)
    expect(composable.searchTerm.value).toBe('')
  })

  describe('keyboard navigation', () => {
    it('opens menu on ArrowDown', () => {
      const { composable } = createWrapper()
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const preventDefault = vi.spyOn(event, 'preventDefault')

      composable.handleKeyDown(event)
      expect(preventDefault).toHaveBeenCalled()
      expect(composable.isOpen.value).toBe(true)
    })

    it('navigates with arrows', () => {
      const { composable } = createWrapper()
      composable.isOpen.value = true

      composable.handleKeyDown(
        new KeyboardEvent('keydown', { key: 'ArrowDown' })
      )
      expect(composable.highlightedIndex.value).toBe(0)
    })

    it('toggles option with Enter', () => {
      const { composable, modelValue } = createWrapper()
      composable.isOpen.value = true
      composable.highlightedIndex.value = 0 // Option 1

      const enter = new KeyboardEvent('keydown', { key: 'Enter' })
      composable.handleKeyDown(enter)

      expect(modelValue.value).toEqual(['opt1'])

      composable.handleKeyDown(enter)
      expect(modelValue.value).toEqual([])
    })
  })

  describe('UI helpers', () => {
    it('creates optionMap correctly', () => {
      const { composable } = createWrapper()
      expect(composable.optionMap.value.get('opt1')).toBe('Option 1')
      expect(composable.optionMap.value.get('opt2')).toBe('Option 2')
    })

    it('returns placeholder when no items selected', () => {
      const { composable } = createWrapper({
        ...defaultProps,
        placeholder: 'Custom Placeholder',
      })
      expect(composable.placeholderText.value).toBe('Custom Placeholder')
    })

    it('returns selected count when items are selected', () => {
      const { composable } = createWrapper(defaultProps, ['opt1', 'opt2'])
      expect(composable.placeholderText.value).toBe('2個選択中...')
    })

    it('falls back to default placeholder if not provided', () => {
      const { composable } = createWrapper({ options: [], label: 'Label' })
      expect(composable.placeholderText.value).toBe('検索')
    })
  })
})
