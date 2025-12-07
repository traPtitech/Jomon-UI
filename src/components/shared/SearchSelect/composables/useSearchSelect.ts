import { type Ref, computed, ref, useId, watch } from 'vue'

import { useSearchSelectHighlight } from '@/components/shared/SearchSelect/composables/useSearchSelectHighlight'
import { useSearchSelectKeyboard } from '@/components/shared/SearchSelect/composables/useSearchSelectKeyboard'
import { useSearchSelectMenu } from '@/components/shared/SearchSelect/composables/useSearchSelectMenu'
import type { Option } from '@/components/shared/types'
import { toString } from '@/components/shared/utils'

export interface SearchSelectCommonProps<T> {
  options: Option<Exclude<T, null>>[]
  label: string
  placeholder?: string | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
}

export type SearchSelectEmit = {
  (e: 'focus' | 'close'): void
  /**
   * Emitted when the search term changes.
   * This event is NOT emitted during IME composition.
   * It fires only after composition ends or on direct input.
   */
  (e: 'search-input', value: string): void
}

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
  /**
   * resetOnClose behavior:
   * - If not specified, defaults to true if model is an array (multi-select), false otherwise (single-select).
   * - If true: reset search term and highlight when menu closes.
   * - If false: keep search term (useful for single select where term = selected label).
   */
  const resetOnClose = options?.resetOnClose ?? Array.isArray(model.value)
  const listboxId = useId()
  const searchTerm = ref('')

  const { isOpen, toggleMenu, openMenu } = useSearchSelectMenu(
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
        toString(opt.value).toLowerCase().includes(lowerTerm)
    )
  })

  const { highlightedIndex, activeOptionId } = useSearchSelectHighlight(
    filteredOptions,
    isOpen,
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
    isOpen.value = true
    if (!isComposing.value) {
      emit('search-input', searchTerm.value)
    }
  }

  const { handleKeyDown } = useSearchSelectKeyboard(
    isOpen,
    highlightedIndex,
    filteredOptions,
    isComposing
  )

  return {
    isOpen,
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
