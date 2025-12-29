<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, useId } from 'vue'

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

import type { Option } from './types'

// Use inline type definition for defineProps to satisfy TS4025 in generic SFC
const props = withDefaults(
  defineProps<{
    options: Option<TValue>[]
    modelValue: TValue | null
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    noResultsText?: string
    errorMessage?: string
    filterFunction?: (option: Option<TValue>, query: string) => boolean
  }>(),
  {
    placeholder: '検索',
    disabled: false,
    required: false,
    modelValue: null,
  }
)

const model = defineModel<TValue | null>({ required: true })

const inputId = useId()
const query = ref('')
const isFocused = ref(false)

const comboButton = ref<InstanceType<typeof ComboboxButton> | null>(null)
const forceOpen = () => {
  if (comboButton.value?.$el instanceof HTMLElement) {
    comboButton.value.$el.click()
  }
}

const isFloating = computed(() => {
  return isFocused.value || query.value.length > 0 || model.value !== null
})

const filteredOptions = computed(() => {
  const options = props.options
  if (query.value === '') return options

  const term = query.value.toLowerCase()
  const selectedOption = options.find(o => o.key === model.value)
  if (selectedOption && query.value === selectedOption.label) return options

  const filterFn = props.filterFunction
  if (filterFn) {
    return options.filter(o => filterFn(o, query.value))
  }
  return options.filter(o => o.label.toLowerCase().includes(term))
})

const displayValue = (item: unknown): string => {
  if (item === null || item === undefined) return ''
  
  if (typeof item === 'string' || typeof item === 'number') {
    const option = props.options.find(o => o.key === item)
    if (option) return option.label
    return String(item)
  }
  return ''
}

/**
 * Handle input focus and clicks to ensure dropdown opens correctly.
 * @param isOpen - Current open state from Combobox slot
 */
const handleInteraction = (isOpen: boolean) => {
  isFocused.value = true
  if (!isOpen) {
    forceOpen()
  }
}

const inputAttrs = (isOpen: boolean) => ({
  id: inputId,
  placeholder: isFloating.value ? props.placeholder : '',
  onInput: (e: Event) => {
    const target = e.target
    if (target instanceof HTMLInputElement) {
      query.value = target.value
    }
  },
  onFocus: () => { handleInteraction(isOpen); },
  onClick: () => { handleInteraction(isOpen); },
  onBlur: () => {
    isFocused.value = false
  },
})

/**
 * Truly type-safe model update without 'as'
 */
function isTValue(val: unknown): val is TValue {
  return props.options.some(o => o.key === val)
}

const onUpdateModel = (val: unknown) => {
  if (val === null) {
    model.value = null
  } else if (isTValue(val)) {
    model.value = val
  }
}
</script>

<template>
  <Combobox
    v-slot="{ open }"
    :model-value="model"
    @update:model-value="onUpdateModel"
    :disabled="props.disabled"
    as="div"
    class="group relative"
    nullable>
    <div
      :class="[
        'flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none',
        props.disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <ComboboxInput
          as="input"
          class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
          :class="[
            label ? 'pt-6' : 'pt-2',
            props.disabled ? 'cursor-not-allowed' : '',
          ]"
          :display-value="displayValue"
          v-bind="inputAttrs(open)" />

        <label
          v-if="label"
          :for="inputId"
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
          :disabled="!!option.disabled"
          v-slot="{ selected, active, disabled: optionDisabled }">
          <li
            class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none"
            :class="{
              'bg-blue-100 text-blue-500': active,
              'text-text-primary': !active,
              'bg-blue-50': selected && !active,
              'cursor-not-allowed opacity-50': optionDisabled,
            }">
            <span class="flex-1 truncate">{{ option.label }}</span>
            <CheckIcon
              v-if="selected"
              class="ml-auto h-4 w-4"
              aria-hidden="true" />
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>