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

  const handleSelect = (selectedValue: T) => {
    model.value = selectedValue
    const selectedOption = props.options.find(
      opt => opt.value === selectedValue
    )
    searchTerm.value =
      selectedOption?.key ??
      (selectedValue !== null ? toString(selectedValue) : '')
    isOpen.value = false
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    baseHandleKeyDown(e, handleSelect)
  }

  // Sync searchTerm with modelValue
  watch(
    () => model.value,
    newVal => {
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

  return {
    ...base,
    handleSelect,
    handleKeyDown,
  }
}
