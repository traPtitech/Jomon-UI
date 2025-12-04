import { defineComponent, h, nextTick, reactive, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import {
  type SearchSelectCommonProps,
  useSearchSelectGeneric,
} from '@/components/shared/composables/useSearchSelect'

const defaultProps: SearchSelectCommonProps<string> = {
  options: [
    { key: 'Option 1', value: 'opt1' },
    { key: 'Option 2', value: 'opt2' },
    { key: 'Other', value: 'other' },
  ],
  label: 'Test Label',
}

describe('useSearchSelect', () => {
  const createWrapper = (
    initialProps: SearchSelectCommonProps<string> = defaultProps,
    initialValue: string | string[] | null = null
  ) => {
    let composable!: ReturnType<typeof useSearchSelectGeneric>
    const emit = vi.fn()
    const modelValue = ref(initialValue)
    const dropdownRef = ref<HTMLElement | null>(null)
    const props = reactive(initialProps)

    const TestComponent = defineComponent({
      setup() {
        composable = useSearchSelectGeneric(
          props,
          emit,
          modelValue,
          dropdownRef
        )
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)
    return { composable, emit, modelValue, wrapper }
  }

  it('initializes search term from modelValue', () => {
    const { composable } = createWrapper(defaultProps, 'opt1')
    expect(composable.searchTerm.value).toBe('Option 1')
  })

  it('updates search term when modelValue changes', async () => {
    const { composable, modelValue } = createWrapper(defaultProps)
    modelValue.value = 'opt2'
    // Watchers run asynchronously
    await nextTick()
    expect(composable.searchTerm.value).toBe('Option 2')

    modelValue.value = null
    await nextTick()
    expect(composable.searchTerm.value).toBe('')

    // Test custom value sync
    modelValue.value = 'custom-val'
    await nextTick()
    expect(composable.searchTerm.value).toBe('custom-val')
  })

  it('filters options based on search term', () => {
    const { composable } = createWrapper()
    composable.menuState.value = 'searched'
    composable.searchTerm.value = 'opt'
    expect(composable.filteredOptions.value).toHaveLength(2)
    expect(composable.filteredOptions.value[0]?.key).toBe('Option 1')
    expect(composable.filteredOptions.value[1]?.key).toBe('Option 2')

    composable.searchTerm.value = 'other'
    expect(composable.filteredOptions.value).toHaveLength(1)
    expect(composable.filteredOptions.value[0]?.key).toBe('Other')
  })

  it('handles input focus', () => {
    const { composable, emit } = createWrapper()
    composable.handleInputFocus()
    expect(emit).toHaveBeenCalledWith('focus')
    expect(composable.menuState.value).toBe('presearch')
  })

  it('handles change', () => {
    const { composable } = createWrapper()
    composable.handleSearchInput()
    expect(composable.menuState.value).toBe('searched')
  })

  describe('keyboard navigation', () => {
    it('opens menu on ArrowDown when closed', () => {
      const { composable } = createWrapper()
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const preventDefault = vi.spyOn(event, 'preventDefault')
      const handleSelect = vi.fn()

      composable.handleKeyDown(event, handleSelect)

      expect(preventDefault).toHaveBeenCalled()
      expect(composable.menuState.value).toBe('presearch')
    })

    it('navigates options with ArrowDown and ArrowUp', () => {
      const { composable } = createWrapper()
      composable.menuState.value = 'presearch'

      const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const arrowUp = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      const handleSelect = vi.fn()

      // Down
      composable.handleKeyDown(arrowDown, handleSelect)
      expect(composable.highlightedIndex.value).toBe(0)

      composable.handleKeyDown(arrowDown, handleSelect)
      expect(composable.highlightedIndex.value).toBe(1)

      // Up
      composable.handleKeyDown(arrowUp, handleSelect)
      expect(composable.highlightedIndex.value).toBe(0)
    })

    it('resets highlightedIndex when search term changes', async () => {
      const { composable } = createWrapper()
      composable.menuState.value = 'presearch'
      composable.highlightedIndex.value = 2

      composable.searchTerm.value = 'new search'
      await nextTick()

      // highlightedIndex should be reset to -1
      expect(composable.highlightedIndex.value).toBe(-1)
    })

    it('skips disabled options on keyboard navigation', async () => {
      const options = [
        { key: '1', value: '1' },
        { key: '2', value: '2', disabled: true },
        { key: '3', value: '3' },
      ]
      const { composable: vm } = createWrapper({ options })
      const handleSelect = vi.fn()

      // Open menu
      vm.handleInputFocus()

      // ArrowDown
      vm.handleKeyDown(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
        handleSelect
      )
      expect(vm.highlightedIndex.value).toBe(0)

      // ArrowDown -> Should skip index 1 (disabled) and go to 2
      vm.handleKeyDown(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
        handleSelect
      )
      expect(vm.highlightedIndex.value).toBe(2)

      // ArrowDown -> Should wrap to 0
      vm.handleKeyDown(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
        handleSelect
      )
      expect(vm.highlightedIndex.value).toBe(0)

      // ArrowUp -> Should wrap to 2 (skipping 1)
      vm.handleKeyDown(
        new KeyboardEvent('keydown', { key: 'ArrowUp' }),
        handleSelect
      )
      expect(vm.highlightedIndex.value).toBe(2)
    })

    it('selects first non-disabled option on Enter if nothing highlighted', async () => {
      const options = [
        { key: '1', value: '1', disabled: true },
        { key: '2', value: '2' },
      ]
      const { composable: vm } = createWrapper({ options })
      const handleSelect = vi.fn()

      // Open menu
      vm.handleInputFocus()

      // Press Enter without navigating
      vm.handleKeyDown(
        new KeyboardEvent('keydown', { key: 'Enter' }),
        handleSelect
      )

      // Should select '2' (first non-disabled)
      expect(handleSelect).toHaveBeenCalledWith('2')
    })

    it('selects option with Enter', () => {
      const { composable } = createWrapper()
      composable.menuState.value = 'presearch'
      composable.highlightedIndex.value = 0 // Option 1

      const enter = new KeyboardEvent('keydown', { key: 'Enter' })
      const handleSelect = vi.fn()

      composable.handleKeyDown(enter, handleSelect)

      expect(handleSelect).toHaveBeenCalledWith('opt1')
    })

    it('closes menu on Escape', async () => {
      const { composable } = createWrapper()
      composable.menuState.value = 'presearch'
      composable.searchTerm.value = 'some search'
      composable.highlightedIndex.value = 0

      const escape = new KeyboardEvent('keydown', { key: 'Escape' })
      const handleSelect = vi.fn()

      // Force transition to ensure watcher triggers
      composable.menuState.value = 'searched'
      await new Promise(resolve => setTimeout(resolve, 10))

      composable.handleKeyDown(escape, handleSelect)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(composable.menuState.value).toBe('close')
      expect(composable.searchTerm.value).toBe('')
    })
  })
})
