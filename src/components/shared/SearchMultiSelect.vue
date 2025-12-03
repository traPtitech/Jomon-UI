<script setup lang="ts" generic="T extends string | number">
import { computed, useTemplateRef } from 'vue'

import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
  isCustomAllowed,
  useSearchSelectGeneric as useSearchSelect,
} from './composables/useSearchSelect'

const props = withDefaults(defineProps<SearchSelectCommonProps<T>>(), {
  placeholder: '検索',
  allowCustom: false,
  disabled: false,
  required: false,
})

const emit = defineEmits<SearchSelectEmit>()
const model = defineModel<T[]>({ required: true, default: () => [] })

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')

const {
  menuState,
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
} = useSearchSelect<T>(props, emit, model, dropdownRef)

const optionMap = computed(() => {
  return new Map(props.options.map(opt => [opt.value, opt.key]))
})

const getPlaceholderText = computed(() => {
  if (model.value.length > 0) {
    return `${String(model.value.length)}個選択中...`
  }
  return props.placeholder
})

const inputRef =
  useTemplateRef<InstanceType<typeof SearchSelectInput>>('inputRef')

const handleSelect = (selectedValue: T) => {
  model.value = model.value.includes(selectedValue)
    ? model.value.filter(v => v !== selectedValue)
    : [...model.value, selectedValue]

  // Focus input if item was removed via click
  if (!model.value.includes(selectedValue)) {
    inputRef.value?.focus()
  }
}

const handleAddCustom = () => {
  if (
    isCustomAllowed<T>(searchTerm.value, props.allowCustom) &&
    !props.options.find(opt => opt.key === searchTerm.value) &&
    !model.value.includes(searchTerm.value)
  ) {
    handleSelect(searchTerm.value)
  }
}

// Handle Backspace to remove the last selected item when search term is empty
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
      ref="inputRef"
      v-model="searchTerm"
      :label="label"
      :placeholder="getPlaceholderText"
      :disabled="disabled"
      :required="required"
      :menu-state="menuState"
      @focus="handleInputFocus"
      @input="handleSearchInput"
      @keydown="handleKeyDown"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @toggle-menu="toggleMenu"
      :aria-expanded="menuState !== 'close'"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionId" />

    <!-- Selected items for multiple selection -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div v-for="val in model" :key="val" class="text-xs">
        {{ optionMap.get(val) ?? val }}
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
      multiple
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
