<script setup lang="ts" generic="T extends string | number">
import { computed, useTemplateRef } from 'vue'

import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
} from './composables/useSearchSelectBase'
import { useSearchSelectMulti } from './composables/useSearchSelectMulti'

const props = withDefaults(defineProps<SearchSelectCommonProps<T>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
})

const emit = defineEmits<SearchSelectEmit>()
const model = defineModel<T[]>({ required: true })

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')
const inputRef =
  useTemplateRef<InstanceType<typeof SearchSelectInput>>('inputRef')

const {
  isOpen,
  searchTerm,
  highlightedIndex,
  filteredOptions,
  handleInputFocus,
  handleSearchInput,
  handleKeyDown,
  handleSelect,
  handleCompositionStart,
  handleCompositionEnd,
  listboxId,
  activeOptionId,
  toggleMenu,
} = useSearchSelectMulti<T>(props, emit, model, dropdownRef, inputRef)

// Note: This implementation assumes that all option values are unique.
// If multiple options share the same value, the last one's key will be used for display.
const optionMap = computed(() => {
  return new Map(props.options.map(opt => [opt.value, opt.key]))
})

const getPlaceholderText = computed(() => {
  if (model.value.length > 0) {
    return `${String(model.value.length)}個選択中...`
  }
  return props.placeholder
})
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

    <!-- Selected items for multiple selection -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div v-for="val in model" :key="val" class="text-xs">
        {{ optionMap.get(val) ?? val }}
        <button
          type="button"
          class="ml-1 rounded-full hover:bg-blue-100"
          :aria-label="`${optionMap.get(val) ?? val} を削除`"
          @click.stop="handleSelect(val)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <SearchSelectDropdown
      v-if="isOpen"
      :id="listboxId"
      :filtered-options="filteredOptions"
      :search-term="searchTerm"
      :highlighted-index="highlightedIndex"
      :model-value="model"
      multiple
      @select-option="handleSelect">
      <template #option-content="{ option, isSelected }">
        <div class="mr-2 flex h-4 w-4 items-center justify-center">
          <CheckIcon v-if="isSelected" class="h-4 w-4" />
        </div>
        <span class="truncate">{{ option.key }}</span>
      </template>
    </SearchSelectDropdown>
  </div>
</template>
