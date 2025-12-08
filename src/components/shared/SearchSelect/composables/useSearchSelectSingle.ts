import { type Ref, watch } from 'vue'

import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
  useSearchSelectBase,
} from '@/components/shared/SearchSelect/composables/useSearchSelectBase'
import { toString } from '@/components/shared/utils'

export const useSearchSelectSingle = <TModel extends string | number | null>(
  props: SearchSelectCommonProps<TModel>,
  emit: SearchSelectEmit,
  model: Ref<TModel>,
  dropdownRef: Ref<HTMLElement | null>
) => {
  const base = useSearchSelectBase(props, emit, dropdownRef, {
    resetOnClose: false,
  })

  const { searchTerm, isOpen, baseHandleKeyDown } = base

  const getLabelFromValue = (val: TModel) => {
    // Determine strict value comparison for finding the option
    if (val === null) return ''
    const selectedOption = props.options.find(opt => opt.value === val)
    if (selectedOption) return selectedOption.key
    return toString(val)
  }

  const handleSelect = (selectedValue: TModel) => {
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

  return {
    ...base,
    handleSelect,
    handleKeyDown,
  }
}
