<script setup lang="ts" generic="TModel extends string | number | null">
/**
 * Single select component with search functionality.
 *
 * Emits:
 * - `update:modelValue`: When the selected value changes.
 * - `search-input`: When the search input value changes (after IME composition).
 * - `focus`: When the input receives focus.
 * - `close`: When the dropdown menu closes.
 */
import { useTemplateRef } from 'vue'

import { CheckIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  type SearchSelectInputRef,
} from './composables/useSearchSelectBase'
import { useSearchSelectSingle } from './composables/useSearchSelectSingle'
import type { SearchSelectEmit } from './types'

/**
 * Generic SearchSelect component for single selection.
 * @template TModel - The type of the model value. Must be string | number | null.
 * options will be automatically typed as Option<NonNullable<TModel>>.
 * Note: Complex objects are not supported as values. Use primitive IDs or codes.
 *
 * Events:
 * - search-input: Emitted when the search term changes.
 *   - Fires on direct input or after IME composition ends found in modern browsers.
 *   - Does NOT fire during IME composition.
 */

const props = withDefaults(defineProps<SearchSelectCommonProps<TModel>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnClose: false,
})

const emit = defineEmits<SearchSelectEmit<TModel>>()
// Note: 'close' event is emitted by useSearchSelectBase (via useSearchSelectSingle) when the menu closes.
// The component itself does not handle 'close' in the template.

const model = defineModel<TModel>({ required: true })

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')
const inputRef = useTemplateRef<SearchSelectInputRef>('inputRef')

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
  handleKeyDown,
  handleSelect,
  handleCompositionStart,
  handleCompositionEnd,
  listboxId,
  activeOptionId,
  toggleMenu,
} = useSearchSelectSingle<TModel>(props, emit, model, dropdownRef)
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
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionId" />

    <SearchSelectDropdown
      v-if="isOpen"
      :listbox-id="listboxId"
      :filtered-options="filteredOptions"
      :search-term="searchTerm"
      :highlighted-index="highlightedIndex"
      :model-value="model"
      :item-height="itemHeight"
      :no-results-text="noResultsText"
      :no-items-text="noItemsText"
      @select-option="handleSelect">
      <template #option-content="{ option, isSelected }">
        <span class="truncate">{{ option.label }}</span>
        <CheckIcon v-if="isSelected" class="ml-auto h-4 w-4" />
      </template>
    </SearchSelectDropdown>
  </div>
</template>
