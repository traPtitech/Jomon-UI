<script setup lang="ts" generic="T extends string | number">
import { useTemplateRef } from 'vue'

import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import {
  type SearchSelectCommonProps,
  type SearchSelectEmit,
} from './composables/useSearchSelectBase'
import { useSearchSelectMulti } from './composables/useSearchSelectMulti'

/**
 * Generic SearchSelect component for multiple selection.
 * @template T - The type of the option value. Must be string | number.
 * Note: Complex objects are not supported as values. Use primitive IDs or codes.
 *
 * Events:
 * - search-input: Emitted when the search term changes.
 *   - Fires on direct input or after IME composition ends found in modern browsers.
 *   - Does NOT fire during IME composition.
 */

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
  optionMap,
  placeholderText,
} = useSearchSelectMulti<T>(props, emit, model, dropdownRef, inputRef)
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
