<script setup lang="ts" generic="T extends string | null">
import { CheckIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  isCustomAllowed,
  useSearchSelectGeneric as useSearchSelect,
} from './composables/useSearchSelect'

const props = withDefaults(
  defineProps<SearchSelectCommonProps<NonNullable<T>>>(),
  {
    placeholder: '検索',
    disabled: false,
    required: false,
  }
)

const emit = defineEmits<{
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()
const model = defineModel<T>({ required: true })

const {
  menuState,
  searchTerm,
  highlightedIndex,
  filteredOptions,
  handleInputFocus,
  handleChange,
  handleKeyDown: baseHandleKeyDown,
  listboxId,
  activeOptionId,
  toggleMenu,
} = useSearchSelect<NonNullable<T>>(props, emit, model)

const handleSelect = (val: T) => {
  if (val === null) return
  const selectedValue = val
  model.value = selectedValue
  const selectedOption = props.options.find(opt => opt.value === selectedValue)
  searchTerm.value = selectedOption?.key ?? selectedValue
  menuState.value = 'close'
}

const handleAddCustom = () => {
  const option = props.options.find(opt => opt.value === searchTerm.value)
  if (option) {
    handleSelect(option.value)
  } else if (
    isCustomAllowed(searchTerm.value, props.allowCustom) &&
    searchTerm.value &&
    !props.options.find(opt => opt.value === searchTerm.value)
  ) {
    handleSelect(searchTerm.value)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  baseHandleKeyDown(
    e,
    handleSelect,
    props.allowCustom ? handleAddCustom : undefined
  )
}
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <SearchSelectInput
      v-model="searchTerm"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :menu-state="menuState"
      @focus="handleInputFocus"
      @input="handleChange"
      @keydown="handleKeyDown"
      @toggle-menu="toggleMenu"
      :aria-expanded="menuState !== 'close'"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionId" />

    <SearchSelectDropdown
      v-if="menuState !== 'close'"
      :id="listboxId"
      :filtered-options="filteredOptions"
      :search-term="searchTerm"
      :highlighted-index="highlightedIndex"
      :model-value="model"
      :allow-custom="!!allowCustom"
      :options="options"
      @select-option="handleSelect"
      @add-custom="handleAddCustom">
      <template #option-content="{ option, isSelected }">
        <span class="truncate">{{ option.key }}</span>
        <CheckIcon v-if="isSelected" class="ml-auto h-4 w-4" />
      </template>
    </SearchSelectDropdown>
  </div>
</template>
