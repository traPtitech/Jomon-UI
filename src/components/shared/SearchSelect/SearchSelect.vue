<script setup lang="ts" generic="TModel extends string | number | null">
import { computed, ref, useTemplateRef } from 'vue'

import { Combobox } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

import { toString } from '@/components/shared/utils'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import { type SearchSelectCommonProps } from './composables/useSearchSelectBase'
import type { SearchSelectEmit } from './types'

const props = withDefaults(defineProps<SearchSelectCommonProps<TModel>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnClose: false,
  theme: () => ({ themeColor: 'blue' }),
})

defineEmits<SearchSelectEmit<TModel>>()
const model = defineModel<TModel>({ required: true })

const query = ref('')

const filteredOptions = computed(() => {
  const searchTerm = query.value
  if (!searchTerm) return props.options

  const filterFunc = props.filterFunction
  if (filterFunc) {
    return props.options.filter(opt => filterFunc(opt, searchTerm))
  }

  const lowerTerm = searchTerm.toLowerCase()
  return props.options.filter(
    opt =>
      opt.label.toLowerCase().includes(lowerTerm) ||
      toString(opt.key).toLowerCase().includes(lowerTerm)
  )
})

const handleUpdate = (value: TModel) => {
  model.value = value
  // Force update query to reflect selected value, bypassing ComboxInput display-value issues
  if (value !== null) {
    query.value = displayValue(value)
  }
  if (props.resetOnClose) {
    query.value = ''
  }
}

const displayValue = (item: unknown) => {
  if (item === null || item === undefined) return ''
  const found = props.options.find(opt => opt.key === item)
  if (found) return found.label
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
      :query="query"
      @change-query="query = $event" />

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
