<script setup lang="ts" generic="TValue extends string | number">
import { useTemplateRef } from 'vue'

import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
  type SearchSelectInputRef,
} from './composables/useSearchSelectBase'
import { useSearchSelectMulti } from './composables/useSearchSelectMulti'

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
})

const emit = defineEmits<SearchSelectEmit>()
// Note: 'close' event is emitted by useSearchSelectBase (via useSearchSelectMulti) when the menu closes.
// The component itself does not handle 'close' in the template.

const model = defineModel<TValue[]>({ required: true })

const dropdownRef = useTemplateRef<HTMLElement>('dropdownRef')
const inputRef = useTemplateRef<SearchSelectInputRef>('inputRef')

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
  optionMap,
  placeholderText,
} = useSearchSelectMulti<TValue>(props, emit, model, dropdownRef, inputRef)

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
      :no-results-text="noResultsText"
      :no-items-text="noItemsText"
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
