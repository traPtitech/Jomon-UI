import {
  type Ref,
  computed,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from 'vue'

import type { Option } from '../types'

// IMPORTANT: This type must ensure that it resolves to false if T is not compatible with string input.
// The isCustomAllowed type guard relies on this behavior.
// If T is a string literal union (e.g. 'foo' | 'bar'), string extends T will be false,
// so allowCustom will be false. This effectively prevents custom values for strict enum-like types.
export type AllowCustom<T> = string extends T ? boolean : false

// CAUTION: This type guard relies on the AllowCustom<T> type definition.
// AllowCustom<T> ensures that allowCustom can only be true if string extends T.
// If AllowCustom<T> is changed to be less strict, this type guard may become unsafe.
export const isCustomAllowed = <T extends string | number>(
  val: string,
  allowCustom: AllowCustom<T> | undefined
): val is T & string => {
  return (allowCustom ?? false) && !!val
}

export interface SearchSelectCommonProps<T> {
  options: Option<T>[]
  label: string
  placeholder?: string | undefined
  allowCustom?: AllowCustom<T> | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
}

export type SearchSelectEmit = {
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}

export type MenuState = 'close' | 'presearch' | 'searched'

export interface RefLike<V> {
  readonly value: V
}

export function useSearchSelectGeneric<T extends string | number>(
  props: SearchSelectCommonProps<T>,
  emit: SearchSelectEmit,
  modelValue: RefLike<T | T[] | null>,
  dropdownRef: Ref<HTMLElement | null>
) {
  const menuState = ref<MenuState>('close')
  const searchTerm = ref('')
  const highlightedIndex = ref(-1)
  const listboxId = useId()

  const activeOptionId = computed(() => {
    if (highlightedIndex.value === -1) return undefined
    return `${listboxId}-option-${String(highlightedIndex.value)}`
  })

  const filteredOptions = computed(() => {
    if (menuState.value === 'presearch') {
      return props.options
    }

    return props.options.filter(option =>
      option.key.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

  watch(
    () => filteredOptions.value,
    () => {
      highlightedIndex.value = -1
    }
  )

  const resetSearchTerm = () => {
    if (Array.isArray(modelValue.value)) {
      searchTerm.value = ''
      return
    }

    if (modelValue.value != null) {
      const selectedOption = props.options.find(
        opt => opt.value === modelValue.value
      )
      searchTerm.value = selectedOption?.key ?? String(modelValue.value)
    } else {
      searchTerm.value = ''
    }
  }

  watch(
    () => modelValue.value,
    () => {
      resetSearchTerm()
    }
  )

  // Handle click outside
  const handleClickOutside = (event: MouseEvent) => {
    if (typeof Node === 'undefined') {
      return
    }
    const target = event.target
    if (!(target instanceof Node)) {
      return
    }
    if (dropdownRef.value && !dropdownRef.value.contains(target)) {
      menuState.value = 'close'
      resetSearchTerm()
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    // Initialize search term for single select
    if (!searchTerm.value) {
      resetSearchTerm()
    }
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })

  watch(menuState, newVal => {
    if (newVal === 'close') emit('close')
  })

  const handleInputFocus = () => {
    emit('focus')
    menuState.value = 'presearch'
    resetSearchTerm()
    highlightedIndex.value = -1
  }

  const handleSearchInput = () => {
    menuState.value = 'searched'
  }

  const isComposing = ref(false)

  const handleCompositionStart = () => {
    isComposing.value = true
  }

  const handleCompositionEnd = () => {
    isComposing.value = false
  }

  const handleKeyDown = (
    e: KeyboardEvent,
    handleSelect: (value: T) => void,
    handleAddCustom?: () => void
  ) => {
    if (e.isComposing || isComposing.value) return

    if (menuState.value === 'close' && e.key === 'ArrowDown') {
      e.preventDefault()
      menuState.value = 'presearch'
      highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1
      return
    }
    if (menuState.value === 'close') return
    emit('keydown', e)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        highlightedIndex.value =
          highlightedIndex.value < filteredOptions.value.length - 1
            ? highlightedIndex.value + 1
            : highlightedIndex.value
        break
      case 'ArrowUp':
        e.preventDefault()
        highlightedIndex.value =
          highlightedIndex.value > 0
            ? highlightedIndex.value - 1
            : highlightedIndex.value
        break
      case 'Home':
        e.preventDefault()
        highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1
        break
      case 'End':
        e.preventDefault()
        highlightedIndex.value =
          filteredOptions.value.length > 0
            ? filteredOptions.value.length - 1
            : -1
        break
      case 'Enter': {
        e.preventDefault()
        const option = filteredOptions.value[highlightedIndex.value]
        // If an option is highlighted, select it.
        // Otherwise, if custom values are allowed and there is a search term, try to add it.
        if (option) {
          handleSelect(option.value)
        } else if (handleAddCustom && searchTerm.value) {
          handleAddCustom()
        }
        break
      }
      case 'Escape':
        menuState.value = 'close'
        resetSearchTerm()
        break
      case 'Tab':
        menuState.value = 'close'
        resetSearchTerm()
        break
    }
  }

  const toggleMenu = () => {
    if (props.disabled) return
    if (menuState.value === 'close') {
      handleInputFocus()
    } else {
      menuState.value = 'close'
    }
  }

  return {
    menuState,
    searchTerm,
    highlightedIndex,
    filteredOptions,
    handleInputFocus,
    handleSearchInput,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    listboxId,
    activeOptionId,
    toggleMenu,
  }
}
