import { type Ref, watch } from 'vue'

import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
  useSearchSelectBase,
} from '@/components/shared/SearchSelect/composables/useSearchSelectBase'
import { toString } from '@/components/shared/utils'

export const useSearchSelectSingle = <T extends string | number | null>(
  props: SearchSelectCommonProps<T>,
  emit: SearchSelectEmit,
  model: Ref<T | null>,
  dropdownRef: Ref<HTMLElement | null>
) => {
  const base = useSearchSelectBase(props, emit, dropdownRef, {
    resetOnClose: false,
  })

  const { searchTerm, isOpen, baseHandleKeyDown } = base

  const getLabelFromValue = (val: T | null) => {
    const selectedOption = props.options.find(opt => opt.value === val)
    if (selectedOption) return selectedOption.key
    if (val !== null) return toString(val)
    return ''
  }

  const handleSelect = (selectedValue: T) => {
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
