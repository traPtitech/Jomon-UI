import { type Ref, watch } from 'vue'

import {
  type SearchSelectCommonProps,
  useSearchSelectBase,
} from '@/components/shared/SearchSelect/composables/useSearchSelectBase'
import { toString } from '@/components/shared/utils'

import type { SearchSelectEmit } from '../types'

export const useSearchSelectSingle = <TModel extends string | number | null>(
  props: SearchSelectCommonProps<TModel>,
  emit: SearchSelectEmit<TModel>,
  model: Ref<TModel>,
  dropdownRef: Ref<HTMLElement | null>
) => {
  const base = useSearchSelectBase(props, emit, dropdownRef)

  const { searchTerm, isOpen, baseHandleKeyDown } = base

  const getLabelFromValue = (val: TModel) => {
    // Determine strict value comparison for finding the option
    if (val === null) return ''
    const selectedOption = props.options.find(opt => opt.key === val)
    if (selectedOption) return selectedOption.label
    return toString(val)
  }

  const handleSelect = (selectedValue: TModel) => {
    // Fail-safe: Option values are NonNullable<TModel>, so we shouldn't get null here.
    if (selectedValue === null) return
    model.value = selectedValue
    searchTerm.value = getLabelFromValue(selectedValue)
    isOpen.value = false
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    baseHandleKeyDown(e, handleSelect)
  }

  // Sync searchTerm with modelValue
  watch(
    () => model.value,
    newVal => {
      searchTerm.value = getLabelFromValue(newVal)
    },
    { immediate: true }
  )

  // Sync searchTerm when menu closes (to revert any unselected input)
  watch(isOpen, newVal => {
    if (!newVal) {
      searchTerm.value = getLabelFromValue(model.value)
    }
  })

  return {
    ...base,
    handleSelect,
    handleKeyDown,
  }
}
