import { type Ref, computed, ref, useId } from 'vue'

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

export const useSearchSelectBase = <T extends string | number | null>(
  props: SearchSelectCommonProps<T>,
  emit: SearchSelectEmit,
  dropdownRef: Ref<HTMLElement | null>,
  options?: { resetOnClose?: boolean }
) => {
  const resetOnClose = options?.resetOnClose ?? true
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

  // Note: We need to cast filteredOptions to Option<any>[] or similar because T might be T | null for Single
  // but Option expect Exclude<T, null>. However, filteredOptions is derived from props.options which is Option<Exclude<T, null>>[]
  // so safe.
  const { highlightedIndex, activeOptionId } = useSearchSelectHighlight(
    filteredOptions,
    isOpen,
    listboxId
  )

  const resetSearchTerm = () => {
    searchTerm.value = ''
    highlightedIndex.value = -1
  }

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

  const handleSearchInput = () => {
    isOpen.value = true
    if (!isComposing.value) {
      emit('search-input', searchTerm.value)
    }
  }

  const { handleKeyDown: baseHandleKeyDown } = useSearchSelectKeyboard(
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
    baseHandleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
    listboxId,
    activeOptionId,
    toggleMenu,
    openMenu,
    isComposing,
  }
}
