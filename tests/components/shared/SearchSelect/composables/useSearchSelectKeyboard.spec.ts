import { ref } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import { useSearchSelectKeyboard } from '@/components/shared/SearchSelect/composables/useSearchSelectKeyboard'
import type { Option } from '@/components/shared/SearchSelect/types'

describe('useSearchSelectKeyboard', () => {
  const options: Option<string>[] = [
    { label: 'Option 1', key: '1' },
    { label: 'Option 2', key: '2' },
    { label: 'Option 3', key: '3', disabled: true },
  ]

  it('should handle ArrowDown', () => {
    const isOpen = ref(true)
    const highlightedIndex = ref(0)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      isOpen,
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
    const isOpen = ref(true)
    const highlightedIndex = ref(1)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      isOpen,
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
    const isOpen = ref(false)
    const highlightedIndex = ref(-1)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      isOpen,
      highlightedIndex,
      filteredOptions,
      isComposing
    )

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    const handleSelect = vi.fn()
    handleKeyDown(event, handleSelect)

    expect(isOpen.value).toBe(true)
  })

  it('should select option on Enter', () => {
    const isOpen = ref(true)
    const highlightedIndex = ref(1)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      isOpen,
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
    const isOpen = ref(true)
    const highlightedIndex = ref(0)
    const filteredOptions = ref(options)
    const isComposing = ref(false)
    const { handleKeyDown } = useSearchSelectKeyboard(
      isOpen,
      highlightedIndex,
      filteredOptions,
      isComposing
    )

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    const handleSelect = vi.fn()
    handleKeyDown(event, handleSelect)

    expect(isOpen.value).toBe(false)
  })
})
