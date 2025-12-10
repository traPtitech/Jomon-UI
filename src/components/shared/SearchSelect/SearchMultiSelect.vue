<script setup lang="ts" generic="TValue extends string | number">
/**
 * Multi-select component with search functionality.
 *
 * Emits:
 * - `update:modelValue`: When the selected values change.
 * - `search-input`: When the search input value changes (after IME composition).
 * - `focus`: When the input receives focus.
 * - `close`: When the dropdown menu closes.
 */
import { computed, useTemplateRef } from 'vue'

import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  type SearchSelectInputRef,
} from './composables/useSearchSelectBase'
import { useSearchSelectMulti } from './composables/useSearchSelectMulti'
import { type SearchSelectEmit } from './types'

/**
 * Generic SearchSelect component for multiple selection.
 * @template TValue - The type of the option value. Must be string | number.
 * Note: Complex objects are not supported as values. Use primitive IDs or codes.
 *
 * Events:
 * - search-input: Emitted when the search term changes.
 *   - Fires on direct input or after IME composition ends found in modern browsers.
 *   - Does NOT fire during IME composition.
 */

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnClose: true,
  itemHeight: 36, // Default item height
  theme: () => ({
    themeColor: 'blue',
  }),
})

const emit = defineEmits<SearchSelectEmit<TValue[]>>()
// Note: 'close' event is emitted by useSearchSelectBase (via useSearchSelectMulti) when the menu closes.
// The component itself does not handle 'close' in the template.

const model = defineModel<TValue[]>({ required: true })

const inputRef = useTemplateRef<SearchSelectInputRef>('inputRef')

// Use structural type for generic component ref to avoid TS2344
const dropdownComponentRef = useTemplateRef<{ el: HTMLElement | null }>(
  'dropdownComponentRef'
)
// Fix: Restore dropdownRef to reference the root wrapper element.
// This wrapper contains both the input and the selected tags (chips).
const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')

// Fix: We must ignore clicks on the entire component wrapper (input + chips)
// so that interacting with chips (e.g., delete) doesn't close the menu.
const outsideClickIgnoreRef = computed(() => dropdownRef.value || null)

// Fix: Create a computed ref for the dropdown element so useSearchSelectBase
// can set up onClickOutside correctly.
const dropdownElementRef = computed(
  () => dropdownComponentRef.value?.el || null
)

const {
  isOpen,
  searchTerm,
  highlightedIndex,
  filteredOptions,
  handleInputFocus,
  handleSearchInput,
  handleCompositionStart,
  handleCompositionEnd,
  listboxId,
  activeOptionId,
  toggleMenu,
  handleSelect,
  handleKeyDown, // handleKeyDown wraps baseHandleKeyDown, so we use this one
  optionMap,
  placeholderText,
} = useSearchSelectMulti<TValue>(
  props,
  emit,
  model,
  dropdownElementRef, // Use computed element ref
  inputRef,
  outsideClickIgnoreRef
)

defineExpose({
  focus: () => {
    inputRef.value?.focus()
  },
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <SearchSelectInput
      ref="inputRef"
      v-model="searchTerm"
      :label="label"
      :placeholder="placeholderText"
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

    <!-- Selected items for multiple selection -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1" role="list">
      <div v-for="val in model" :key="val" class="text-xs" role="listitem">
        {{ optionMap.get(val) ?? val }}
        <button
          type="button"
          :class="[
            'ml-1 rounded-full',
            theme?.themeColor === 'gray'
              ? 'hover:bg-gray-100'
              : 'hover:bg-blue-100',
          ]"
          :aria-label="`${optionMap.get(val) ?? val} を削除`"
          @click.stop="handleSelect(val)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <SearchSelectDropdown
      v-if="isOpen"
      ref="dropdownComponentRef"
      :listbox-id="listboxId"
      :filtered-options="filteredOptions"
      :search-term="searchTerm"
      :highlighted-index="highlightedIndex"
      :model-value="model"
      :reference-element="inputRef?.el || null"
      :multiple="true"
      :item-height="itemHeight"
      :no-results-text="noResultsText"
      :no-items-text="noItemsText"
      :theme="theme"
      @select-option="handleSelect">
      <template #option-content="{ option, isSelected }">
        <div class="mr-2 flex h-4 w-4 items-center justify-center">
          <CheckIcon v-if="isSelected" class="h-4 w-4" />
        </div>
        <span class="truncate">{{ option.label }}</span>
      </template>
    </SearchSelectDropdown>
  </div>
</template>
