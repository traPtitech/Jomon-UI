import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import type { Option } from '../types'

export interface UseSearchSelectProps<T> {
  options: Option<T>[]
  label: string
  placeholder?: string | undefined
  allowCustom?: boolean | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
}

export type SearchSelectEmit = {
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}

export function useSearchSelectGeneric<T extends string>(
  props: UseSearchSelectProps<T>,
  emit: SearchSelectEmit,
  modelValue: { value: T | T[] | null }
) {
  type MenuState = 'close' | 'presearch' | 'searched'
  const menuState = ref<MenuState>('close')
  const searchTerm = ref('')
  const highlightedIndex = ref(-1)
  const dropdownRef = ref<HTMLElement | null>(null)

  const filteredOptions = computed(() => {
    if (menuState.value === 'presearch') {
      return props.options
    }

    return props.options.filter(option =>
      option.key.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

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
      // Reset search term if single select and has value
      if (!Array.isArray(modelValue.value) && modelValue.value) {
        const selectedOption = props.options.find(
          opt => opt.value === modelValue.value
        )
        searchTerm.value = selectedOption?.key ?? ''
      } else if (!Array.isArray(modelValue.value)) {
        searchTerm.value = ''
      }
    }
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    // Initialize search term for single select
    if (
      !Array.isArray(modelValue.value) &&
      modelValue.value &&
      !searchTerm.value
    ) {
      const selectedOption = props.options.find(
        opt => opt.value === modelValue.value
      )
      searchTerm.value = selectedOption?.key ?? ''
    }
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
  })

  watch(menuState, () => {
    if (menuState.value === 'close') emit('close')
  })

  const handleInputFocus = () => {
    emit('focus')
    menuState.value = 'presearch'
    if (!Array.isArray(modelValue.value) && modelValue.value) {
      const selectedOption = props.options.find(
        opt => opt.value === modelValue.value
      )
      searchTerm.value = selectedOption?.key ?? ''
    }
  }

  const handleChange = () => {
    menuState.value = 'searched'
  }

  const handleKeyDown = (
    e: KeyboardEvent,
    handleSelect: (value: T) => void,
    handleAddCustom?: () => void
  ) => {
    if (
      menuState.value === 'close' &&
      (e.key === 'ArrowDown' || e.key === 'Enter')
    ) {
      e.preventDefault()
      menuState.value = 'presearch'
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
      case 'Enter': {
        e.preventDefault()
        const option = filteredOptions.value[highlightedIndex.value]
        if (option) {
          handleSelect(option.value)
        } else if (handleAddCustom && searchTerm.value) {
          handleAddCustom()
        }
        break
      }
      case 'Escape':
        menuState.value = 'close'
        if (!Array.isArray(modelValue.value) && modelValue.value) {
          const selectedOption = props.options.find(
            opt => opt.value === modelValue.value
          )
          searchTerm.value = selectedOption?.key ?? ''
        } else {
          searchTerm.value = ''
        }
        break
      case 'Tab':
        menuState.value = 'close'
        break
    }
  }

  return {
    menuState,
    searchTerm,
    highlightedIndex,
    dropdownRef,
    filteredOptions,
    handleInputFocus,
    handleChange,
    handleKeyDown,
  }
}
