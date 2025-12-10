<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, useTemplateRef } from 'vue'

import { Combobox } from '@headlessui/vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import { toString } from '@/components/shared/utils'

import SearchSelectDropdown from './SearchSelectDropdown.vue'
import SearchSelectInput from './SearchSelectInput.vue'
import { type SearchSelectCommonProps } from './composables/useSearchSelectBase'
import type { SearchSelectEmit } from './types'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnClose: true,
  theme: () => ({ themeColor: 'blue' }),
})

defineEmits<SearchSelectEmit<TValue[]>>()
const model = defineModel<TValue[]>({ required: true })

const query = ref('')

// Filtering logic
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

const handleUpdate = (value: TValue[]) => {
  model.value = value
  if (props.resetOnClose) {
    query.value = ''
  }
}

const displayValue = () => {
  return query.value // In multi-select, input displays query?
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

// Option Map for Tags
const optionMap = computed(() => {
  const map = new Map<string | number, string>()
  for (const option of props.options) {
    map.set(option.key, option.label)
  }
  return map
})

const removeItem = (val: TValue) => {
  model.value = model.value.filter(v => v !== val)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Backspace' && query.value === '' && model.value.length > 0) {
    const newValue = [...model.value]
    newValue.pop()
    model.value = newValue
  }
}
</script>

<template>
  <Combobox
    :model-value="model"
    :disabled="!!disabled"
    multiple
    nullable
    as="div"
    class="relative"
    @update:model-value="handleUpdate"
    v-slot="{ open }">
    <SearchSelectInput
      ref="inputComponentRef"
      :label="label"
      :placeholder="model.length === 0 ? placeholder : ''"
      :required="required"
      :disabled="disabled"
      :display-value="displayValue"
      :is-open="open"
      :query="query"
      @keydown="handleKeyDown"
      @change-query="query = $event" />

    <!-- Selected items (Tags) -->
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
          @click.stop="removeItem(val)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

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
        <div class="mr-2 flex h-4 w-4 items-center justify-center">
          <CheckIcon v-if="selected" class="h-4 w-4" />
        </div>
        <span class="truncate" :class="{ 'font-semibold': selected }">
          {{ option.label }}
        </span>
      </template>
    </SearchSelectDropdown>
  </Combobox>
</template>
