import { ref } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import { useSearchSelectKeyboard } from '@/components/shared/SearchSelect/composables/useSearchSelectKeyboard'
import type { MenuState } from '@/components/shared/SearchSelect/composables/useSearchSelectMenu'
import type { Option } from '@/components/shared/types'

describe('useSearchSelectKeyboard', () => {
  const options: Option<string>[] = [
    { key: 'Option 1', value: '1' },
    { key: 'Option 2', value: '2' },
    { key: 'Option 3', value: '3', disabled: true },
  ]

  it('should handle ArrowDown', () => {
    const menuState = ref<MenuState>('presearch')
    const highlightedIndex = ref(0)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      menuState,
      highlightedIndex,
      filteredOptions,
      isComposing
    )

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    const handleSelect = vi.fn()
    handleKeyDown(event, handleSelect)

    expect(highlightedIndex.value).toBe(1)
  })

  it('should skip disabled options on ArrowDown', () => {
    const menuState = ref<MenuState>('presearch')
    const highlightedIndex = ref(1)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      menuState,
      highlightedIndex,
      filteredOptions,
      isComposing
    )

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    const handleSelect = vi.fn()
    handleKeyDown(event, handleSelect)

    // Should skip index 2 (disabled) and go to 0
    expect(highlightedIndex.value).toBe(0)
  })

  it('should open menu on ArrowDown if closed', () => {
    const menuState = ref<MenuState>('close')
    const highlightedIndex = ref(-1)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      menuState,
      highlightedIndex,
      filteredOptions,
      isComposing
    )

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    const handleSelect = vi.fn()
    handleKeyDown(event, handleSelect)

    expect(menuState.value).toBe('presearch')
  })

  it('should select option on Enter', () => {
    const menuState = ref<MenuState>('presearch')
    const highlightedIndex = ref(1)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      menuState,
      highlightedIndex,
      filteredOptions,
      isComposing
    )

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    const handleSelect = vi.fn()
    handleKeyDown(event, handleSelect)

    expect(handleSelect).toHaveBeenCalledWith('2')
  })

  it('should close menu on Escape', () => {
    const menuState = ref<MenuState>('presearch')
    const highlightedIndex = ref(0)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      menuState,
      highlightedIndex,
      filteredOptions,
      isComposing
    )

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    const handleSelect = vi.fn()
    handleKeyDown(event, handleSelect)

    expect(menuState.value).toBe('close')
  })
})
