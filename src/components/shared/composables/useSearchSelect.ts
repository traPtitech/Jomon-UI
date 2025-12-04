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
  (e: 'search-input', value: string): void
}

export type MenuState = 'close' | 'presearch' | 'searched'

export interface RefLike<V> {
  readonly value: V
}

export const useSearchSelect = <T>(
  props: SearchSelectCommonProps<T>,
  emit: SearchSelectEmit,
  model: RefLike<T | T[] | null>,
  dropdownRef: Ref<HTMLElement | null>
) => {
  const listboxId = useId()
  const menuState = ref<MenuState>('close')
  const searchTerm = ref('')
  const highlightedIndex = ref(-1)

  const filteredOptions = computed(() => {
    if (!searchTerm.value) {
      return props.options
    }
    const lowerTerm = searchTerm.value.toLowerCase()
    return props.options.filter(
      opt =>
        opt.key.toLowerCase().includes(lowerTerm) ||
        String(opt.value).toLowerCase().includes(lowerTerm)
    )
  })

  const activeOptionId = computed(() => {
    if (highlightedIndex.value === -1) return undefined
    return `${listboxId}-option-${String(highlightedIndex.value)}`
  })

  const resetSearchTerm = () => {
    searchTerm.value = ''
    highlightedIndex.value = -1
  }

  // Initialize highlightedIndex when menu opens or options change
  watch(menuState, newVal => {
    if (newVal !== 'close') {
      highlightedIndex.value = -1
    } else {
      resetSearchTerm()
    }
  })

  watch(filteredOptions, () => {
    highlightedIndex.value = -1
  })

  // Sync searchTerm with modelValue for single select
  watch(
    () => model.value,
    newVal => {
      if (Array.isArray(newVal)) return
      const selectedOption = props.options.find(opt => opt.value === newVal)
      if (selectedOption) {
        searchTerm.value = selectedOption.key
      } else if (newVal !== null && newVal !== undefined) {
        searchTerm.value = String(newVal)
      } else {
        searchTerm.value = ''
      }
    },
    { immediate: true }
  )

  const toggleMenu = () => {
    if (props.disabled) return
    if (menuState.value === 'close') {
      menuState.value = 'presearch'
    } else {
      menuState.value = 'close'
    }
  }

  const handleInputFocus = () => {
    if (props.disabled) return
    if (menuState.value === 'close') {
      menuState.value = 'presearch'
    }
  }

  const handleSearchInput = () => {
    menuState.value = 'searched'
    emit('search-input', searchTerm.value)
  }

  // IME handling
  const isComposing = ref(false)
  const handleCompositionStart = () => {
    isComposing.value = true
  }
  const handleCompositionEnd = () => {
    isComposing.value = false
  }

  const handleKeyDown = (
    e: KeyboardEvent,
    handleSelect: (val: T) => void,
    handleAddCustom?: () => void
  ) => {
    if (isComposing.value || e.isComposing) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (menuState.value === 'close') {
          menuState.value = 'presearch'
          highlightedIndex.value = 0
        } else {
          highlightedIndex.value =
            (highlightedIndex.value + 1) % filteredOptions.value.length
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (menuState.value === 'close') {
          menuState.value = 'presearch'
          highlightedIndex.value = filteredOptions.value.length - 1
        } else {
          highlightedIndex.value =
            (highlightedIndex.value - 1 + filteredOptions.value.length) %
            filteredOptions.value.length
        }
        break
      case 'Home':
        e.preventDefault()
        if (menuState.value !== 'close' && filteredOptions.value.length > 0) {
          highlightedIndex.value = 0
        }
        break
      case 'End':
        e.preventDefault()
        if (menuState.value !== 'close' && filteredOptions.value.length > 0) {
          highlightedIndex.value = filteredOptions.value.length - 1
        }
        break
      case 'Enter': {
        e.preventDefault()
        if (menuState.value === 'close') {
          menuState.value = 'presearch'
          return
        }

        // If an item is highlighted, select it
        if (highlightedIndex.value !== -1) {
          const option = filteredOptions.value[highlightedIndex.value]
          if (option) {
            handleSelect(option.value)
          }
          return
        }

        // If no item is highlighted but there are filtered options, select the first one
        if (filteredOptions.value.length > 0) {
          const option = filteredOptions.value[0]
          if (option) {
            handleSelect(option.value)
          }
          return
        }

        // If no options match and custom is allowed, add custom
        if (handleAddCustom && searchTerm.value) {
          handleAddCustom()
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

  const handleClickOutside = (event: MouseEvent) => {
    if (typeof Node === 'undefined') {
      return
    }
    const target = event.target
    if (!(target instanceof Node)) {
      return
    }
    // Note: This check assumes the dropdown is not Teleported elsewhere in the DOM.
    // If Teleport is used, we need to check if the target is contained within the teleported content as well.
    if (dropdownRef.value && !dropdownRef.value.contains(target)) {
      menuState.value = 'close'
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

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

export const useSearchSelectGeneric = useSearchSelect
