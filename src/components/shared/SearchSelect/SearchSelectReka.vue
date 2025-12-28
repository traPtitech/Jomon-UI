<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref } from 'vue'

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  ComboboxAnchor,
} from 'reka-ui'

import type {
  Option,
  SearchSelectCommonProps,
  SearchSelectEmit,
} from './types'

// Props & Emits
const props = withDefaults(defineProps<SearchSelectCommonProps<TValue> & { modelValue: TValue | null }>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: false,
  errorMessage: undefined,
  modelValue: null
})

const emit = defineEmits<SearchSelectEmit<TValue | null>>()

// Reka UI Combobox works with v-model.
// It accepts `modelValue` as the value of the selected item.
// However, Reka UI Combobox usually expects the whole object or a specific value type.
// Let's bind it to `modelValue` (the key).

// We need a local model for v-model binding if we want to intercept or just use defineModel directly if Reka supports it.
// Reka `ComboboxRoot` v-model matches the `value` prop of `ComboboxItem`.

const localModel = computed({
  get: () => props.modelValue,
  set: (val) => {
    console.log('Reka: localModel set', val)
    emit('update:modelValue', val)
  }
})

const searchTerm = ref('')
const open = ref(false)

const handleInputFocus = () => {
  open.value = true
}

const filteredOptions = computed(() => {
  const selectedOption = props.options.find(o => o.key === localModel.value)
  // Smart Filtering: If search term matches the selected label exactly, show all options
  if (selectedOption && searchTerm.value === selectedOption.label) {
    return props.options
  }

  if (searchTerm.value === '') {
    return props.options
  }
  const term = searchTerm.value.toLowerCase()
  if (props.filterFunction) {
    return props.options.filter(option => props.filterFunction!(option, searchTerm.value))
  }
  return props.options.filter(option => option.label.toLowerCase().includes(term))
})

// Helper to get label for display in input (if needed, but ComboboxInput usually handles text input)
// Reka UI ComboboxInput displays the text content of the selected item if `displayValue` is not used, 
// OR we can bind it. Reka UI is "headless", so we control the input value via v-model:searchTerm?
// Reka UI `ComboboxRoot` has `v-model:searchTerm`.
</script>

<template>
  <ComboboxRoot
    v-model="localModel"
    v-model:open="open"
    :disabled="disabled"
    class="relative group"
    nullable
  >
    <ComboboxAnchor class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:ring-2 focus-within:ring-white/75 focus-within:ring-offset-2 focus-within:ring-offset-teal-300 sm:text-sm">
      <ComboboxInput
        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none"
        :placeholder="placeholder"
        v-model="searchTerm"
        :display-value="(val: any) => options.find(o => o.key === val)?.label ?? ''"
        @keydown.enter.prevent
        @focus="handleInputFocus"
      />
       <label class="absolute left-3 top-0 text-xs text-gray-500" v-if="label">{{ label }}</label>

      <ComboboxTrigger class="absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        class="box-border max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
        :side-offset="5"
        position="popper"
        align="start"
        :style="{ width: 'var(--reka-combobox-trigger-width)', minWidth: 'var(--reka-combobox-trigger-width)' }"
      >
        <ComboboxViewport>
          <ComboboxEmpty class="relative cursor-default select-none px-4 py-2 text-gray-700">
             {{ noResultsText || '該当する項目がありません。' }}
          </ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="String(option.key)"
              :value="option.key"
              :disabled="option.disabled"
              class="relative cursor-default select-none py-2 pl-10 pr-4 data-[highlighted]:bg-blue-600 data-[highlighted]:text-white text-gray-900 outline-none"
            >
              <span class="block truncate" :class="{ 'font-medium': localModel === option.key, 'font-normal': localModel !== option.key }">
                {{ option.label }}
              </span>
              
              <ComboboxItemIndicator class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 data-[highlighted]:text-white">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
