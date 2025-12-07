<script setup lang="ts" generic="T extends string | number | null">
import { useTemplateRef } from 'vue'

import { CheckIcon } from '@heroicons/vue/24/outline'

import { toString } from '../utils'
import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
  useSearchSelectGeneric as useSearchSelect,
} from './composables/useSearchSelect'

const props = withDefaults(defineProps<SearchSelectCommonProps<T>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
})

const emit = defineEmits<SearchSelectEmit>()
const model = defineModel<T>({ required: true })

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')
const inputRef =
  useTemplateRef<InstanceType<typeof SearchSelectInput>>('inputRef')

defineExpose({
  focus: () => {
    inputRef.value?.focus()
  },
})

const {
  isOpen,
  searchTerm,
  highlightedIndex,
  filteredOptions,
  handleInputFocus,
  handleSearchInput,
  handleKeyDown: baseHandleKeyDown,
  handleCompositionStart,
  handleCompositionEnd,
  listboxId,
  activeOptionId,
  toggleMenu,
} = useSearchSelect<T>(props, emit, model, dropdownRef, {
  resetOnClose: false,
})

const handleSelect = (selectedValue: T) => {
  model.value = selectedValue
  const selectedOption = props.options.find(opt => opt.value === selectedValue)
  searchTerm.value =
    selectedOption?.key ??
    (selectedValue !== null ? toString(selectedValue) : '')
  isOpen.value = false
}

const handleKeyDown = (e: KeyboardEvent) => {
  baseHandleKeyDown(e, handleSelect)
}
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <SearchSelectInput
      ref="inputRef"
      v-model="searchTerm"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :is-open="isOpen"
      @focus="handleInputFocus"
      @input="handleSearchInput"
      @keydown="handleKeyDown"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @toggle-menu="toggleMenu"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionId" />

    <SearchSelectDropdown
      v-if="isOpen"
      :id="listboxId"
      :filtered-options="filteredOptions"
      :search-term="searchTerm"
      :highlighted-index="highlightedIndex"
      :model-value="model"
      @select-option="handleSelect">
      <template #option-content="{ option, isSelected }">
        <span class="truncate">{{ option.key }}</span>
        <CheckIcon v-if="isSelected" class="ml-auto h-4 w-4" />
      </template>
    </SearchSelectDropdown>
  </div>
</template>
