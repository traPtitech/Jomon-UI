import type { Ref } from 'vue'

import type { MenuState } from '@/components/shared/composables/useSearchSelectMenu'
import type { Option } from '@/components/shared/types'

export const useSearchSelectKeyboard = <T>(
  menuState: Ref<MenuState>,
  highlightedIndex: Ref<number>,
  filteredOptions: Ref<Option<T>[]>,
  isComposing: Ref<boolean>
) => {
  const handleKeyDown = (e: KeyboardEvent, handleSelect: (val: T) => void) => {
    if (isComposing.value || e.isComposing) return

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
        if (menuState.value === 'close') {
          menuState.value = 'presearch'
        }
        moveHighlight(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (menuState.value === 'close') {
          menuState.value = 'presearch'
        }
        moveHighlight(-1)
        break
      case 'Home':
        e.preventDefault()
        if (menuState.value !== 'close' && filteredOptions.value.length > 0) {
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
        e.preventDefault()
        if (menuState.value !== 'close' && filteredOptions.value.length > 0) {
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
        if (menuState.value === 'close') {
          menuState.value = 'presearch'
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
        menuState.value = 'close'
        break
      case 'Tab':
        menuState.value = 'close'
        break
    }
  }

  return {
    handleKeyDown,
  }
}
