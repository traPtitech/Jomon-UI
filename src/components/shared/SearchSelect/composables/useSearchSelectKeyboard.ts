import type { Ref } from 'vue'

import type { Option } from '@/components/shared/types'

export const useSearchSelectKeyboard = <T>(
  isOpen: Ref<boolean>,
  highlightedIndex: Ref<number>,
  filteredOptions: Ref<Option<T>[]>,
  isComposing: Ref<boolean>
) => {
  const handleKeyDown = (e: KeyboardEvent, handleSelect: (val: T) => void) => {
    if (isComposing.value || e.isComposing) return

    // Key bindings:
    // - ArrowUp/ArrowDown: Cycle through options (skipping disabled)
    // - Home/End: Jump to first/last non-disabled option
    // - Enter: Select highlighted option or first non-disabled option if none highlighted
    // - Escape: Close menu
    // - Tab: Close menu (allow default tab behavior)

    const moveHighlight = (direction: 1 | -1) => {
      if (filteredOptions.value.length === 0) return

      let next = highlightedIndex.value
      // Adjust starting point for ArrowUp when nothing is highlighted
      if (next === -1 && direction === -1) {
        next = 0
      }

      for (let i = 0; i < filteredOptions.value.length; i++) {
        next =
          (next + direction + filteredOptions.value.length) %
          filteredOptions.value.length
        if (!filteredOptions.value[next]?.disabled) {
          highlightedIndex.value = next
          return
        }
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        isOpen.value = true
        moveHighlight(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        isOpen.value = true
        moveHighlight(-1)
        break
      case 'Home':
        if (!isOpen.value) return
        e.preventDefault()
        if (filteredOptions.value.length > 0) {
          // Find first non-disabled option
          const firstIndex = filteredOptions.value.findIndex(
            opt => !opt.disabled
          )
          if (firstIndex !== -1) {
            highlightedIndex.value = firstIndex
          }
        }
        break
      case 'End':
        if (!isOpen.value) return
        e.preventDefault()
        if (filteredOptions.value.length > 0) {
          // Find last non-disabled option
          for (let i = filteredOptions.value.length - 1; i >= 0; i--) {
            if (!filteredOptions.value[i]?.disabled) {
              highlightedIndex.value = i
              break
            }
          }
        }
        break
      case 'Enter': {
        e.preventDefault()
        // 1. If menu is closed, just open it
        if (!isOpen.value) {
          isOpen.value = true
          return
        }

        // 2. If an item is highlighted, select it if not disabled
        if (highlightedIndex.value !== -1) {
          const option = filteredOptions.value[highlightedIndex.value]
          if (option && !option.disabled) {
            handleSelect(option.value)
          }
          return
        }

        // 3. If no item is highlighted but there are filtered options, select the first non-disabled one
        if (filteredOptions.value.length > 0) {
          const option = filteredOptions.value.find(opt => !opt.disabled)
          if (option) {
            handleSelect(option.value)
            return
          }
        }

        break
      }
      case 'Escape':
        e.preventDefault()
        isOpen.value = false
        break
      case 'Tab':
        isOpen.value = false
        break
    }
  }

  return {
    handleKeyDown,
  }
}
