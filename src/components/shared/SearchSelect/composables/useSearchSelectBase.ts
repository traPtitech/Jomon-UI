import { type Ref, computed, ref, useId, watch } from 'vue'

import { onClickOutside } from '@vueuse/core'

import { useSearchSelectHighlight } from '@/components/shared/SearchSelect/composables/useSearchSelectHighlight'
import { useSearchSelectKeyboard } from '@/components/shared/SearchSelect/composables/useSearchSelectKeyboard'
import { toString } from '@/components/shared/utils'

import type { Option, SearchSelectBaseEmit, SearchSelectTheme } from '../types'

export interface SearchSelectCommonProps<
  TModel extends string | number | null,
> {
  options: Option<NonNullable<TModel>>[]
  label: string
  placeholder?: string | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
  /**
   * Optional custom filter function.
   * Return true to include the option in the filtered list.
   * @param option The option to test.
   * @param searchTerm The current search term (not lower-cased).
   */
  filterFunction?:
    | ((option: Option<NonNullable<TModel>>, searchTerm: string) => boolean)
    | undefined
  /**
   * Whether to reset the search term when the menu closes.
   * @default true
   * Note: Single Select components (SearchSelect.vue) may override this to `false` to persist the selected label.
   */
  resetOnClose?: boolean | undefined
  /**
   * Text to display when no options match the search term.
   * @default '該当する項目がありません。'
   */
  noResultsText?: string | undefined
  /**
   * Text to display when there are no options available at all.
   * @default '項目がありません。'
   */
  noItemsText?: string | undefined
  /**
   * Height of each item in the virtual list (pixels).
   * @default 36
   */
  itemHeight?: number | undefined
  /**
   * Theming options.
   */
  theme?: SearchSelectTheme | undefined
}

export interface SearchSelectInputRef {
  focus: () => void
  select: () => void
  el: HTMLElement | null
}

export const useSearchSelectBase = <TModel extends string | number | null>(
  props: SearchSelectCommonProps<TModel>,
  emit: SearchSelectBaseEmit,
  dropdownRef: Ref<HTMLElement | null>,
  outsideClickIgnoreRef?: Ref<HTMLElement | null>
) => {
  // resetOnClose defaults to true.
  const resetOnClose = computed(() => {
    return props.resetOnClose ?? true
  })

  const listboxId = useId()
  const searchTerm = ref('')

  const resetSearchTerm = () => {
    searchTerm.value = ''
    // highlightedIndex is reset by useSearchSelectHighlight watcher on isOpen change
  }

  const handleCloseMenu = () => {
    emit('close')
    if (resetOnClose.value) {
      resetSearchTerm()
    }
  }

  const isOpen = ref(false)

  const toggleMenu = () => {
    if (props.disabled) return
    isOpen.value = !isOpen.value
  }

  const openMenu = () => {
    if (props.disabled) return
    isOpen.value = true
  }

  const closeMenu = () => {
    isOpen.value = false
  }

  onClickOutside(
    dropdownRef,
    () => {
      closeMenu()
    },
    {
      ignore: outsideClickIgnoreRef ? [outsideClickIgnoreRef] : [],
    }
  )

  // Close menu if disabled prop changes to true
  watch(
    () => props.disabled,
    (disabled: boolean | undefined) => {
      if (disabled) {
        isOpen.value = false
      }
    }
  )

  watch(
    isOpen,
    (newVal: boolean) => {
      if (!newVal) {
        handleCloseMenu()
      }
    },
    { flush: 'sync' }
  )

  const filteredOptions = computed(() => {
    if (!searchTerm.value) {
      return props.options
    }
    const filterFunc = props.filterFunction
    if (filterFunc) {
      return props.options.filter(opt => filterFunc(opt, searchTerm.value))
    }
    const lowerTerm = searchTerm.value.toLowerCase()
    return props.options.filter(
      opt =>
        opt.label.toLowerCase().includes(lowerTerm) ||
        toString(opt.key).toLowerCase().includes(lowerTerm)
    )
  })

  // Note: filteredOptions is derived from props.options which is Option<NonNullable<TModel>>[].
  const { highlightedIndex, activeOptionId } = useSearchSelectHighlight(
    filteredOptions,
    isOpen,
    listboxId
  )

  const handleInputFocus = (event: FocusEvent) => {
    if (props.disabled) return
    emit('focus', event)
    openMenu()
  }

  // Helper to deduplicate search-input events
  const lastEmittedTerm = ref('')
  const emitSearchInput = () => {
    if (searchTerm.value === lastEmittedTerm.value) return
    lastEmittedTerm.value = searchTerm.value
    emit('search-input', searchTerm.value)
  }

  // IME handling
  const isComposing = ref(false)
  const handleCompositionStart = () => {
    isComposing.value = true
  }
  const handleCompositionEnd = () => {
    isComposing.value = false
    // Emit search-input explicitly on composition end to ensure consistency across browsers.
    emitSearchInput()
  }

  const handleSearchInput = (event?: Event) => {
    openMenu()
    // Note: We check both our internal isComposing state (from compositionstart/end)
    // and the native InputEvent.isComposing property for robustness.
    const isNativeInputEvent =
      typeof InputEvent !== 'undefined' && event instanceof InputEvent
    const composingNow =
      isComposing.value || (isNativeInputEvent && event.isComposing)

    // Only emit if not composing.
    // Note: If compositionend handled the emit already, this might duplicate the event if it fires after.
    // Typically, input fires before compositionend or right after.
    // If it fires right after and isComposing is false, we emit again.
    // Consumers (like API calls) usually debounce or are idempotent for same values, so this is acceptable for robustness.
    if (!composingNow) {
      emitSearchInput()
    }
  }

  if (import.meta.env.DEV) {
    const keys = props.options.map(o => o.key)
    const uniqueSize = new Set(keys).size
    if (uniqueSize !== keys.length) {
      console.warn(
        '[SearchSelect] option.key must be unique. Duplicates detected.',
        keys
      )
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
    closeMenu,
    isComposing,
  }
}
