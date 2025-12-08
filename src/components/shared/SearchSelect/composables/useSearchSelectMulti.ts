import { type Ref, computed } from 'vue'

import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
  useSearchSelectBase,
} from '@/components/shared/SearchSelect/composables/useSearchSelectBase'

export interface SearchSelectInputRef {
  focus: () => void
}

export const useSearchSelectMulti = <T extends string | number>(
  props: SearchSelectCommonProps<T>,
  emit: SearchSelectEmit,
  model: Ref<T[]>,
  dropdownRef: Ref<HTMLElement | null>,
  inputRef?: Ref<SearchSelectInputRef | null>
) => {
  const base = useSearchSelectBase(props, emit, dropdownRef, {
    resetOnClose: true,
  })
  const { searchTerm, baseHandleKeyDown } = base

  const handleSelect = (selectedValue: T) => {
    // Check if the value is already selected.
    // Note: We're assuming T is a primitive (string | number) so checking equality works fine.
    const isSelected = model.value.includes(selectedValue)
    model.value = isSelected
      ? model.value.filter(v => v !== selectedValue)
      : [...model.value, selectedValue]

    // Focus input if item was removed via click
    // We restore focus on removal to allow continuous deletions or immediate search for replacement.
    // On addition, we don't force focus back to input to keep the flow natural (or to allow other interactions).
    if (isSelected) {
      inputRef?.value?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      searchTerm.value === '' &&
      e.key === 'Backspace' &&
      model.value.length > 0
    ) {
      const newModel = [...model.value]
      newModel.pop()
      model.value = newModel
      return
    }

    baseHandleKeyDown(e, handleSelect)
  }

  // Note: This implementation assumes that all option values are unique.
  // If multiple options share the same value, the last one's key will be used for display.
  const optionMap = computed(() => {
    return new Map(props.options.map(opt => [opt.value, opt.key]))
  })

  const placeholderText = computed(() => {
    if (model.value.length > 0) {
      return `${String(model.value.length)}個選択中...`
    }
    return props.placeholder ?? '検索'
  })

  return {
    ...base,
    handleSelect,
    handleKeyDown,
    optionMap,
    placeholderText,
  }
}
