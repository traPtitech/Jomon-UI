<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, watch } from 'vue'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/24/outline'

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
  resetOnSelect: true, // Default true for Multi
  errorMessage: undefined,
  modelValue: () => []
})

const emit = defineEmits<SearchSelectEmit<TValue[]>>()

const localValue = ref<TValue[]>([])

watch(() => props.modelValue, (val) => {
  localValue.value = val
}, { immediate: true })

watch(localValue, (val) => {
  emit('update:modelValue', val)
})

// State
const query = ref('')

// Filtering Logic
const filteredOptions = computed(() => {
  if (query.value === '') {
    return props.options
  }
  const term = query.value.toLowerCase()
  
  if (props.filterFunction) {
    return props.options.filter(option => 
      props.filterFunction!(option, query.value)
    )
  }

  return props.options.filter(option => {
    return option.label.toLowerCase().includes(term)
  })
})

// Helper to get label from key
const getLabel = (key: TValue) => {
  const option = props.options.find(o => o.key === key)
  return option ? option.label : String(key)
}

const removeTag = (key: TValue) => {
  if (props.disabled) return
  localValue.value = localValue.value.filter(v => v !== key)
}

// Clear query on selection if resetOnSelect is true
watch(localValue, () => {
  if (props.resetOnSelect) {
    query.value = ''
  }
})
</script>

<template>
  <Combobox
    v-model="localValue"
    :disabled="disabled"
    as="div"
    class="relative group"
    multiple
    nullable>
    
    <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
      <ComboboxInput
        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
        :placeholder="placeholder"
        @change="query = $event.target.value"
        :display-value="() => query" 
      />
      <!-- Note: display-value for MultiSelect usually reflects the query, not the selection. Selection is tags. -->
      
       <label class="absolute left-3 top-0 text-xs text-gray-500" v-if="label">{{ label }}</label>

      <ComboboxButton
        class="absolute inset-y-0 right-0 flex items-center pr-2"
      >
        <ChevronUpDownIcon
          class="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </ComboboxButton>
    </div>

    <!-- Tags Display -->
    <div v-if="localValue.length > 0" class="mt-2 flex flex-wrap gap-1">
      <span
        v-for="key in localValue"
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
    
    <TransitionRoot
      leave="transition ease-in duration-100"
      leave-from="opacity-100"
      leave-to="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions
        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
      >
        <div
          v-if="filteredOptions.length === 0 && query !== ''"
          class="relative cursor-default select-none px-4 py-2 text-gray-700"
        >
          {{ noResultsText || '該当する項目がありません。' }}
        </div>

        <ComboboxOption
          v-for="option in filteredOptions"
          as="template"
          :key="String(option.key)"
          :value="option.key"
          :disabled="option.disabled"
          v-slot="{ selected, active }"
        >
          <li
            class="relative cursor-default select-none py-2 pl-10 pr-4"
            :class="{
              'bg-blue-600 text-white': active,
              'text-gray-900': !active,
            }"
          >
            <span
              class="block truncate"
              :class="{ 'font-medium': selected, 'font-normal': !selected }"
            >
              {{ option.label }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-3"
              :class="{ 'text-white': active, 'text-blue-600': !active }"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
