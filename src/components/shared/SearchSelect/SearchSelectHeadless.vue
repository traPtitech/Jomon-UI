<script setup lang="ts" generic="TValue extends string | number | null">
import { computed, ref } from 'vue'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'

import type {
  SearchSelectCommonProps,
  SearchSelectEmit,
} from './types'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: false,
  errorMessage: undefined,
})

const emit = defineEmits<SearchSelectEmit<TValue | null>>()
const model = defineModel<TValue | null>({ required: true })

const query = ref('')
const isFocused = ref(false)

const handleInputFocus = () => {
  // Headless UI opens automatically on click/input but sometimes needs explicit trigger if button didn't open it.
  // We can try to rely on default behavior or keep button ref trick if needed.
  // The 'open on focus' fix was implemented earlier.
  // But wait, the previous fix used a button ref.
  // Let's re-implement it cleanly.
}

const comboButton = ref<InstanceType<typeof ComboboxButton> | null>(null)
const forceOpen = () => {
  if (comboButton.value?.$el) {
    comboButton.value.$el.click()
  }
}

// Float if focused, has query, or has model value
const isFloating = computed(() => {
  return isFocused.value || query.value.length > 0 || !!model.value
})

const filteredOptions = computed(() => {
  if (query.value === '') return props.options
  const term = query.value.toLowerCase()
  // Smart Filtering check? If query == selected label?
  const selectedOption = props.options.find(o => o.key === model.value)
  if (selectedOption && query.value === selectedOption.label) return props.options

  if (props.filterFunction) {
    return props.options.filter(o => props.filterFunction!(o, query.value))
  }
  return props.options.filter(o => o.label.toLowerCase().includes(term))
})

const displayValue = (item: unknown): string => {
  if (item === null || item === undefined) return ''
  const option = props.options.find(o => o.key === item)
  return option ? option.label : String(item)
}
</script>

<template>
  <Combobox
    v-model="model"
    :disabled="disabled"
    as="div"
    class="relative group"
    nullable
  >
    <!-- BaseTextInput style wrapper -->
    <div
      :class="[
        'flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none',
        disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]"
    >
      <!-- Prefix Icon -->
      <div class="pl-3 flex items-center justify-center">
         <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <ComboboxInput
          class="peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none text-base text-text-primary"
          :class="[label ? 'pt-6' : 'pt-2', disabled ? 'cursor-not-allowed' : '']"
          :display-value="displayValue"
          :placeholder="isFloating ? placeholder : ''"
          @change="query = $event.target.value"
          @focus="isFocused = true; forceOpen()"
          @blur="isFocused = false"
        />
        
        <label
          v-if="label"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500"
          :class="[
            isFloating
              ? 'top-1 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2 text-base',
          ]">
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </label>
      </div>

      <ComboboxButton ref="comboButton" class="flex items-center pr-2">
        <ChevronDownIcon
          class="h-4 w-4 text-text-secondary"
          aria-hidden="true" />
      </ComboboxButton>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 px-3 text-sm text-error-primary">
      {{ errorMessage }}
    </p>

    <TransitionRoot
      leave="transition ease-in duration-100"
      leave-from="opacity-100"
      leave-to="opacity-0"
      @after-leave="query = ''">
      <ComboboxOptions
        class="absolute z-50 mt-1 max-h-[200px] w-full overflow-auto rounded-md border bg-white p-1 shadow-lg focus:outline-none">
        <div
          v-if="filteredOptions.length === 0 && query !== ''"
          class="relative cursor-default px-2 py-1.5 text-sm text-gray-700 select-none">
          {{ noResultsText || '該当する項目がありません。' }}
        </div>

        <ComboboxOption
          v-for="option in filteredOptions"
          as="template"
          :key="String(option.key)"
          :value="option.key"
          :disabled="option.disabled"
          v-slot="{ selected, active, disabled }"
        >
          <li
            class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none"
            :class="{
              'bg-blue-100 text-blue-500': active,
              'text-text-primary': !active,
              'bg-blue-50': selected && !active, // Slight bg for selected
              'cursor-not-allowed opacity-50': disabled
            }"
          >
            <span class="truncate flex-1">{{ option.label }}</span>
            <CheckIcon v-if="selected" class="ml-auto h-4 w-4" aria-hidden="true" />
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
