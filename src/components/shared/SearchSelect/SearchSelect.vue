<script setup lang="ts" generic="TValue extends string | number | null">
import { computed, ref, useTemplateRef } from 'vue'

import { Combobox } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

import { toString } from '@/components/shared/utils'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import { useSearchSelectFiltering } from './composables/useSearchSelectFiltering'
import type { SearchSelectCommonProps, SearchSelectEmit } from './types'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: false,
  theme: () => ({ themeColor: 'blue' }),
  errorMessage: undefined,
})

const emit = defineEmits<SearchSelectEmit<TValue>>()
const model = defineModel<TValue>({ required: true })

// Query starts empty even if model has value.
// The initial display is handled by `displayValue` prop on ComboboxInput.
const query = ref('')

const filteredOptions = useSearchSelectFiltering(
  () => props.options,
  query,
  props.filterFunction
)

const handleUpdate = (value: TValue) => {
  model.value = value
  // Force update query to reflect selected value.
  // This ensures that the filtering state is consistent with the current selection.
  // If we didn't update `query`, it might remain as the user's partial input (e.g. "fo" after selecting "foo").
  // When resetOnSelect is false (default for SingleSelect), this also ensures the input text matches the selected label.
  if (value !== null) {
    query.value = displayValue(value)
  } else {
    // Clear query when value is null (deselected)
    query.value = ''
  }
  // If resetOnSelect is true, clear the query after selection.
  // The display remains correct because Combobox manages the input value via displayValue.
  if (props.resetOnSelect) {
    query.value = ''
  }
}

const displayValue = (item: unknown) => {
  if (item === null || item === undefined) return ''
  const found = props.options.find(opt => opt.key === item)
  if (found) return found.label
  if (props.options.length > 0 && item !== '') {
    console.warn('[SearchSelect] modelValue is not in options', item)
  }
  return typeof item === 'string' || typeof item === 'number'
    ? toString(item)
    : ''
}

const inputComponentRef =
  useTemplateRef<InstanceType<typeof SearchSelectInput>>('inputComponentRef')

defineExpose({
  focus: () => {
    inputComponentRef.value?.focus()
  },
})

const referenceElement = computed(() => {
  return inputComponentRef.value?.el || null
})
</script>

<template>
  <Combobox
    :model-value="model"
    :disabled="!!disabled"
    nullable
    as="div"
    class="relative"
    @update:model-value="handleUpdate"
    v-slot="{ open }">
    <SearchSelectInput
      ref="inputComponentRef"
      :label="label"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :display-value="displayValue"
      :is-open="open"
      :has-value="query !== '' || model !== null"
      :error-message="errorMessage"
      @change-query="query = $event"
      @keydown="emit('keydown', $event)"
      @close="emit('close')" />

    <SearchSelectDropdown
      v-if="open"
      :filtered-options="filteredOptions"
      :search-term="query"
      :theme="theme"
      :no-results-text="noResultsText"
      :no-items-text="noItemsText"
      :item-height="itemHeight"
      :reference-element="referenceElement">
      <template #option-content="{ option, selected }">
        <span
          class="truncate"
          :class="{ 'font-medium': selected, 'font-normal': !selected }">
          {{ option.label }}
        </span>
        <CheckIcon v-if="selected" class="ml-auto h-4 w-4" />
      </template>
    </SearchSelectDropdown>
  </Combobox>
</template>
