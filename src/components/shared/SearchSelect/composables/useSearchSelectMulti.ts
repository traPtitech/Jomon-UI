import { type Ref, computed } from 'vue'

import {
  type SearchSelectCommonProps,
  type SearchSelectInputRef,
  useSearchSelectBase,
} from '@/components/shared/SearchSelect/composables/useSearchSelectBase'

import type { SearchSelectEmit } from '../types'

export const useSearchSelectMulti = <TValue extends string | number>(
  props: SearchSelectCommonProps<TValue>,
  emit: SearchSelectEmit<TValue[]>,
  model: Ref<TValue[]>,
  dropdownRef: Ref<HTMLElement | null>,
  inputRef?: Ref<SearchSelectInputRef | null>
) => {
  // For MultiSelect, TModel is effectively TValue because it doesn't support null in the array elements usually.
  // We assume that the model array does NOT contain null values (TValue extends string | number).
  // However, SearchSelectCommonProps expects TModel, so strict types might mismatch if we passed TValue directly without checking.
  // If we pass TValue as TModel, then options are Option<NonNullable<TValue>>[], which is Option<TValue>[] since TValue is string|number.
  const base = useSearchSelectBase<TValue>(props, emit, dropdownRef)
  const { searchTerm, baseHandleKeyDown, isComposing } = base

  const handleSelect = (selectedValue: TValue) => {
    // Check if the value is already selected.
    // Note: We're assuming TValue is a primitive (string | number) so checking equality works fine.
    const isSelected = model.value.includes(selectedValue)
    model.value = isSelected
      ? model.value.filter(v => v !== selectedValue)
      : [...model.value, selectedValue]

    // Note: detailed UX decision:
    // For Multi Select, we keep the menu OPEN after selection to allow selecting multiple items.
    // This contrasts with Single Select which typically closes on selection.

    // Focus input if item was removed via click
    // We restore focus on removal to allow continuous deletions or immediate search for replacement.
    // On addition, we don't force focus back to input to keep the flow natural (or to allow other interactions).
    if (isSelected) {
      inputRef?.value?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Backspace UX:
    // If search term is empty and tags exist, the last tag is deleted.
    // This allows users to delete selections without using the mouse or special delete buttons.
    if (
      !isComposing.value &&
      !e.isComposing &&
      searchTerm.value === '' &&
      e.key === 'Backspace' &&
      model.value.length > 0
    ) {
      e.preventDefault()
      const newModel = [...model.value]
      newModel.pop()
      model.value = newModel
      return
    }

    baseHandleKeyDown(e, handleSelect)
  }

  // Note: This implementation assumes that all option values are unique.
  // If multiple options share the same value, the last one's key will be used for display.
  // It is strongly recommended to ensure option values are unique.
  const optionMap = computed(() => {
    return new Map(props.options.map(opt => [opt.key, opt.label]))
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
