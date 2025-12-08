import { defineComponent, h, nextTick, reactive, ref } from 'vue'

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { type SearchSelectCommonProps } from '@/components/shared/SearchSelect/composables/useSearchSelectBase'
import { useSearchSelectSingle } from '@/components/shared/SearchSelect/composables/useSearchSelectSingle'

const defaultProps: SearchSelectCommonProps<string> = {
  options: [
    { key: 'Option 1', value: 'opt1' },
    { key: 'Option 2', value: 'opt2' },
    { key: 'Other', value: 'other' },
  ],
  label: 'Test Label',
}

describe('useSearchSelectSingle', () => {
  const createWrapper = (
    initialProps: SearchSelectCommonProps<string> = defaultProps,
    initialValue: string | null = null
  ) => {
    let composable!: ReturnType<typeof useSearchSelectSingle<string>>
    const emit = vi.fn()
    const modelValue = ref(initialValue)
    const dropdownRef = ref<HTMLElement | null>(null)
    const props = reactive(initialProps)

    const TestComponent = defineComponent({
      setup() {
        composable = useSearchSelectSingle<string>(
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
  })

  it('filters options based on search term', () => {
    const { composable } = createWrapper()
    composable.isOpen.value = true
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
    expect(composable.isOpen.value).toBe(true)
  })

  it('handles change', () => {
    const { composable } = createWrapper()
    composable.handleSearchInput()
    expect(composable.isOpen.value).toBe(true)
  })

  it('does not emit search-input during IME composition', () => {
    const { composable, emit } = createWrapper()

    // Start composition
    composable.handleCompositionStart()
    composable.searchTerm.value = 'te'
    composable.handleSearchInput()

    expect(emit).not.toHaveBeenCalledWith('search-input', expect.anything())

    // End composition
    composable.handleCompositionEnd()
    composable.searchTerm.value = 'test'
    composable.handleSearchInput()

    expect(emit).toHaveBeenCalledWith('search-input', 'test')
  })

  describe('keyboard navigation', () => {
    it('opens menu on ArrowDown when closed', () => {
      const { composable } = createWrapper()
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const preventDefault = vi.spyOn(event, 'preventDefault')

      composable.handleKeyDown(event)

      expect(preventDefault).toHaveBeenCalled()
      expect(composable.isOpen.value).toBe(true)
    })

    it('navigates options with ArrowDown and ArrowUp', () => {
      const { composable } = createWrapper()
      composable.isOpen.value = true

      const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const arrowUp = new KeyboardEvent('keydown', { key: 'ArrowUp' })

      // Down
      composable.handleKeyDown(arrowDown)
      expect(composable.highlightedIndex.value).toBe(0)

      composable.handleKeyDown(arrowDown)
      expect(composable.highlightedIndex.value).toBe(1)

      // Up
      composable.handleKeyDown(arrowUp)
      expect(composable.highlightedIndex.value).toBe(0)
    })

    it('resets highlightedIndex when search term changes', async () => {
      const { composable } = createWrapper()
      composable.isOpen.value = true
      composable.highlightedIndex.value = 2

      composable.searchTerm.value = 'new search'
      await nextTick()

      // highlightedIndex should be reset to -1
      expect(composable.highlightedIndex.value).toBe(-1)
    })

    it('skips disabled options on keyboard navigation', () => {
      const options = [
        { key: '1', value: '1' },
        { key: '2', value: '2', disabled: true },
        { key: '3', value: '3' },
      ]
      const { composable: vm } = createWrapper({ ...defaultProps, options })

      // Open menu
      vm.handleInputFocus()

      // ArrowDown
      vm.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      expect(vm.highlightedIndex.value).toBe(0)

      // ArrowDown -> Should skip index 1 (disabled) and go to 2
      vm.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      expect(vm.highlightedIndex.value).toBe(2)

      // ArrowDown -> Should wrap to 0
      vm.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      expect(vm.highlightedIndex.value).toBe(0)

      // ArrowUp -> Should wrap to 2 (skipping 1)
      vm.handleKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
      expect(vm.highlightedIndex.value).toBe(2)
    })

    it('selects first non-disabled option on Enter if nothing highlighted', () => {
      const options = [
        { key: '1', value: '1', disabled: true },
        { key: '2', value: '2' },
      ]
      const { composable: vm, modelValue } = createWrapper({
        ...defaultProps,
        options,
      })

      // Open menu
      vm.handleInputFocus()

      // Press Enter without navigating
      vm.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))

      // Should select '2' (first non-disabled)
      expect(modelValue.value).toBe('2')
    })

    it('selects option with Enter', () => {
      const { composable, modelValue } = createWrapper()
      composable.isOpen.value = true
      composable.highlightedIndex.value = 0 // Option 1

      const enter = new KeyboardEvent('keydown', { key: 'Enter' })

      composable.handleKeyDown(enter)

      expect(modelValue.value).toBe('opt1')
    })

    it('closes menu on Escape', async () => {
      const { composable } = createWrapper()
      composable.isOpen.value = true
      composable.searchTerm.value = 'some search'
      composable.highlightedIndex.value = 0

      const escape = new KeyboardEvent('keydown', { key: 'Escape' })

      // Force transition to ensure watcher triggers
      await new Promise(resolve => setTimeout(resolve, 10))

      composable.handleKeyDown(escape)
      await new Promise(resolve => setTimeout(resolve, 10))

      expect(composable.isOpen.value).toBe(false)
      expect(composable.searchTerm.value).toBe('some search')
    })

    it('highlights first non-disabled option on Home', () => {
      const options = [
        { key: '1', value: '1', disabled: true },
        { key: '2', value: '2' },
        { key: '3', value: '3' },
      ]
      const { composable: vm } = createWrapper({ ...defaultProps, options })

      // Open menu and highlight last option
      vm.isOpen.value = true
      vm.highlightedIndex.value = 2

      vm.handleKeyDown(new KeyboardEvent('keydown', { key: 'Home' }))

      expect(vm.highlightedIndex.value).toBe(1) // Index 1 is the first non-disabled
    })

    it('highlights last non-disabled option on End', () => {
      const options = [
        { key: '1', value: '1' },
        { key: '2', value: '2' },
        { key: '3', value: '3', disabled: true },
      ]
      const { composable: vm } = createWrapper({ ...defaultProps, options })

      // Open menu and highlight first option
      vm.isOpen.value = true
      vm.highlightedIndex.value = 0

      vm.handleKeyDown(new KeyboardEvent('keydown', { key: 'End' }))

      expect(vm.highlightedIndex.value).toBe(1) // Index 1 is the last non-disabled (Index 2 is disabled)
    })

    it('closes menu on Tab', () => {
      const { composable } = createWrapper()
      composable.isOpen.value = true

      composable.handleKeyDown(new KeyboardEvent('keydown', { key: 'Tab' }))

      expect(composable.isOpen.value).toBe(false)
    })
  })
})
