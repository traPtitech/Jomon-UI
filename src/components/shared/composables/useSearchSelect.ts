import { type Ref, computed, ref, useId, watch } from 'vue'

import { useSearchSelectHighlight } from '@/components/shared/composables/useSearchSelectHighlight'
import { useSearchSelectKeyboard } from '@/components/shared/composables/useSearchSelectKeyboard'
import {
  type MenuState,
  useSearchSelectMenu,
} from '@/components/shared/composables/useSearchSelectMenu'
import type { Option } from '@/components/shared/types'
import { toString } from '@/components/shared/utils'

export interface SearchSelectCommonProps<T> {
  options: Option<T>[]
  label: string
  placeholder?: string | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
}

export type SearchSelectEmit = {
  (e: 'focus' | 'close'): void
  /**
   * Emitted when the search term changes.
   * This event is not emitted during IME composition.
   */
  (e: 'search-input', value: string): void
}

export type { MenuState }

export interface RefLike<V> {
  readonly value: V
}

export const useSearchSelect = <T extends string | number | null>(
  props: SearchSelectCommonProps<T>,
  emit: SearchSelectEmit,
  model: RefLike<T | T[] | null>,
  dropdownRef: Ref<HTMLElement | null>,
  options?: { resetOnClose?: boolean }
) => {
  const resetOnClose = options?.resetOnClose ?? Array.isArray(model.value)
  const listboxId = useId()
  const searchTerm = ref('')

  const { menuState, toggleMenu, openMenu } = useSearchSelectMenu(
    props,
    dropdownRef,
    () => {
      emit('close')
      if (resetOnClose) {
        resetSearchTerm()
      }
    }
  )

  const filteredOptions = computed(() => {
    if (!searchTerm.value) {
      return props.options
    }
    const lowerTerm = searchTerm.value.toLowerCase()
    return props.options.filter(
      opt =>
        opt.key.toLowerCase().includes(lowerTerm) ||
        (opt.value !== null &&
          toString(opt.value).toLowerCase().includes(lowerTerm))
    )
  })

  const { highlightedIndex, activeOptionId } = useSearchSelectHighlight(
    filteredOptions,
    menuState,
    listboxId
  )

  const resetSearchTerm = () => {
    searchTerm.value = ''
    highlightedIndex.value = -1
  }

  // Sync searchTerm with modelValue for single select
  watch(
    () => model.value,
    newVal => {
      if (Array.isArray(newVal)) return
      const selectedOption = props.options.find(opt => opt.value === newVal)
      if (selectedOption) {
        searchTerm.value = selectedOption.key
      } else if (newVal !== null) {
        searchTerm.value = toString(newVal)
      } else {
        searchTerm.value = ''
      }
    },
    { immediate: true }
  )

  const handleInputFocus = () => {
    if (props.disabled) return
    emit('focus')
    openMenu()
  }

  // IME handling
  const isComposing = ref(false)
  const handleCompositionStart = () => {
    isComposing.value = true
  }
  const handleCompositionEnd = () => {
    isComposing.value = false
  }

  // v-model handles the update, so we don't need to read the event
  const handleSearchInput = () => {
    menuState.value = 'searched'
    if (!isComposing.value) {
      emit('search-input', searchTerm.value)
    }
  }

  const { handleKeyDown } = useSearchSelectKeyboard(
    menuState,
    highlightedIndex,
    filteredOptions,
    isComposing
  )

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
