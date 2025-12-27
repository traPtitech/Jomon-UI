<script setup lang="ts" generic="TValue extends string | number | null">
import { computed, nextTick, ref, toRaw, watch } from 'vue'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'

import type {
  Option,
  SearchSelectCommonProps,
  SearchSelectEmit,
} from './types'

// Props & Emits
const emit = defineEmits<SearchSelectEmit<TValue | null>>()

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue> & { modelValue: TValue | null }>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: false,
  errorMessage: undefined,
  modelValue: null
})

const comboButton = ref<InstanceType<typeof ComboboxButton> | null>(null)

const handleInputFocus = () => {
  // If not already open (Headless UI doesn't easily expose open state outside slot, but we can try to force open)
  // A simple hack is to click the button if it exists.
  // Ideally we check if open.
  // For prototype, let's just click the button on focus if we can.
  // But button toggles. If already open (e.g. from click), focus might close it?
  // Headless UI Combobox opens on click input usually if configured? No, usually explicitly.
  if (comboButton.value?.$el) {
    comboButton.value.$el.click()
  }
}

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

watch(localValue, (val) => {
  console.log('Local value updated:', val)
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

// Display Value Logic for Input
const displayValue = (item: unknown): string => {
  // Headless UI passes the raw value (Option object or key depending on binding)
  // We will bind 'Option' object to value but model is 'key'.
  // Actually, let's bind key to value to match current behavior.
  
  if (item === null || item === undefined) return ''
  
  // If item is key
  const option = props.options.find(o => o.key === item)
  return option ? option.label : String(item)
}

// Handler for update
// We need to handle the fact that Headless UI might return the whole object if we bind :value="option"
// or just the key if we bind :value="option.key"
</script>

<template>
  <Combobox
    v-model="localValue"
    :disabled="disabled"
    as="div"
    class="relative group"
    nullable>
    
    <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
      <ComboboxInput
        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
        :display-value="displayValue"
        :placeholder="placeholder"
        @change="query = $event.target.value"
        @focus="handleInputFocus"
      />
      
      <!-- Label Logic (Simplified for prototype) -->
       <label class="absolute left-3 top-0 text-xs text-gray-500" v-if="label">{{ label }}</label>

      <ComboboxButton
        ref="comboButton"
        class="absolute inset-y-0 right-0 flex items-center pr-2"
      >
        <ChevronUpDownIcon
          class="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </ComboboxButton>
    </div>
    
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
  </Combobox>
</template>
