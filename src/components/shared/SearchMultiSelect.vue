<script setup lang="ts" generic="T extends string">
import { computed, useTemplateRef } from 'vue'

import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  isCustomAllowed,
  useSearchSelectGeneric as useSearchSelect,
} from './composables/useSearchSelect'

const props = withDefaults(defineProps<SearchSelectCommonProps<T>>(), {
  placeholder: '検索',
  allowCustom: false,
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()
const model = defineModel<T[]>({ required: true, default: () => [] })

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')

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
} = useSearchSelect<T>(props, emit, model, dropdownRef)

const getPlaceholderText = computed(() => {
  if (model.value.length > 0) {
    return `${String(model.value.length)}個選択中...`
  }
  return props.placeholder
})

const handleSelect = (selectedValue: T) => {
  model.value = model.value.includes(selectedValue)
    ? model.value.filter(v => v !== selectedValue)
    : [...model.value, selectedValue]
}

const handleAddCustom = () => {
  if (
    isCustomAllowed<T>(searchTerm.value, props.allowCustom) &&
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
      :placeholder="getPlaceholderText"
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

    <!-- Selected items for multiple selection -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div v-for="val in model" :key="val" class="text-xs">
        {{ options.find(opt => opt.value === val)?.key || val }}
        <button
          type="button"
          class="ml-1 rounded-full hover:bg-blue-100"
          @click.stop="handleSelect(val)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

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
        <div class="mr-2 flex h-4 w-4 items-center justify-center">
          <CheckIcon v-if="isSelected" class="h-4 w-4" />
        </div>
        <span class="truncate">{{ option.key }}</span>
      </template>
    </SearchSelectDropdown>
  </div>
</template>
