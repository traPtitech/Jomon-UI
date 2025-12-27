<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, watch } from 'vue'

import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/24/outline'
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
} from 'reka-ui'

import type {
  Option,
  SearchSelectCommonProps,
  SearchSelectEmit,
} from './types'

// Props & Emits
const props = withDefaults(defineProps<SearchSelectCommonProps<TValue> & { modelValue: TValue[] }>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: true,
  errorMessage: undefined,
  modelValue: () => []
})

const emit = defineEmits<SearchSelectEmit<TValue[]>>()

// Reka UI Combobox Root supports `multiple` prop.
// v-model should be an array.
const localModel = computed({
  get: () => props.modelValue,
  set: (val) => {
    // Reka might return null/undefined depending on state, but multiple should be array
    const value = val || []
    emit('update:modelValue', value)
  }
})

const searchTerm = ref('')

const filteredOptions = computed(() => {
  if (searchTerm.value === '') {
    return props.options
  }
  const term = searchTerm.value.toLowerCase()
  if (props.filterFunction) {
    return props.options.filter(option => props.filterFunction!(option, searchTerm.value))
  }
  return props.options.filter(option => option.label.toLowerCase().includes(term))
})

const getLabel = (key: TValue) => {
  const option = props.options.find(o => o.key === key)
  return option ? option.label : String(key)
}

const removeTag = (key: TValue) => {
  if (props.disabled) return
  const newValue = localModel.value.filter(v => v !== key)
  emit('update:modelValue', newValue)
}

// Clear search term on select if resetOnSelect is true
watch(() => props.modelValue, (newVal, oldVal) => {
  if (props.resetOnSelect && newVal.length > (oldVal?.length || 0)) {
     // Item added
     searchTerm.value = ''
  }
}, { deep: true })

</script>

<template>
  <ComboboxRoot
    v-model="localModel"
    v-model:searchTerm="searchTerm"
    :disabled="disabled"
    class="relative group"
    multiple
    nullable
  >
    <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:ring-2 focus-within:ring-white/75 focus-within:ring-offset-2 focus-within:ring-offset-teal-300 sm:text-sm">
      <div class="flex flex-wrap gap-1 p-1">
        <!-- Tags Display Inside Input Area (Common for MultiSelect) or Outside? 
             Current Jomon implementation has tags outside (below). 
             Headless UI implementation put tags below. 
             Let's follow suit or put them inside for "modern" look?
             Spec says "Breaking changes ... acceptable".
             Let's put inside for tighter UI, or below if safer. 
             Let's put below for now to match structure of prototype 1.
        -->
        
        <ComboboxInput
          class="w-full border-none py-1 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none min-h-[2rem]"
          :placeholder="placeholder"
          @keydown.enter.prevent
        />
      </div>
      
       <label class="absolute left-3 top-0 text-xs text-gray-500" v-if="label">{{ label }}</label>

      <ComboboxTrigger class="absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxTrigger>
    </div>

    <!-- Tags Display -->
    <div v-if="localModel.length > 0" class="mt-2 flex flex-wrap gap-1">
      <span
        v-for="key in localModel"
        :key="String(key)"
        class="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
      >
        {{ getLabel(key) }}
        <button
          type="button"
          class="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:bg-gray-500 focus:text-white focus:outline-none"
          @click.stop="removeTag(key)"
        >
          <span class="sr-only">Remove {{ getLabel(key) }}</span>
          <XMarkIcon class="h-3 w-3" aria-hidden="true" />
        </button>
      </span>
    </div>

    <ComboboxPortal>
      <ComboboxContent
        class="absolute mt-1 max-h-60 w-[var(--radix-combobox-trigger-width)] min-w-[var(--radix-combobox-trigger-width)] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
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
               <span class="block truncate" :class="{ 'font-medium': localModel.includes(option.key), 'font-normal': !localModel.includes(option.key) }">
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
