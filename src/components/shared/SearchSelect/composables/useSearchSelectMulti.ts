import { type Ref } from 'vue'

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

  return {
    ...base,
    handleSelect,
    handleKeyDown,
  }
}
