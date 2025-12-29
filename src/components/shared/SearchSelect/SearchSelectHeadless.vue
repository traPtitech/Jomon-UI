<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, useId } from 'vue'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
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

// defineModel handles modelValue, so it is removed from defineProps to avoid duplication.
const props = withDefaults(
  defineProps<{
    options: Option<TValue>[]
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    name?: string
    noResultsText?: string
    errorMessage?: string
    filterFunction?: (option: Option<TValue>, query: string) => boolean
  }>(),
  {
    placeholder: '検索',
    disabled: false,
    required: false,
    name: '', // Use empty string as default to satisfy exactOptionalPropertyTypes
  }
)

const model = defineModel<TValue | null>({ required: true })

const inputId = useId()
const errorId = `${inputId}-error`
const query = ref('')
const isFocused = ref(false)

// Performance optimization: O(1) lookups
const optionMap = computed(() => new Map(props.options.map(o => [o.key, o])))
// Cast to Set<unknown> to simplify checks against unknown 'val'
const keySet = computed(() => new Set<unknown>(props.options.map(o => o.key)))

const comboButton = ref<InstanceType<typeof ComboboxButton> | null>(null)

// Workaround for lack of "openOnFocus" prop in Headless UI Vue v1.
const forceOpen = () => {
  if (comboButton.value?.$el instanceof HTMLElement) {
    comboButton.value.$el.click()
  }
}

const isFloating = computed(() => {
  return isFocused.value || query.value.length > 0 || model.value !== null
})

const filteredOptions = computed(() => {
  if (query.value === '') return props.options

  const term = query.value.toLowerCase()
  const filterFn = props.filterFunction
  if (filterFn) {
    return props.options.filter(o => filterFn(o, query.value))
  }
  return props.options.filter(o => o.label.toLowerCase().includes(term))
})

const displayValue = (item: unknown): string => {
  if (item === null || item === undefined) return ''
  if (typeof item === 'string' || typeof item === 'number') {
    return optionMap.value.get(item as TValue)?.label ?? String(item)
  }
  return ''
}

const handleInteraction = (isOpen: boolean) => {
  isFocused.value = true
  if (!isOpen) {
    forceOpen()
  }
}

const inputAttrs = (isOpen: boolean) => ({
  id: inputId,
  placeholder: isFloating.value || !props.label ? props.placeholder : '',
  onInput: (e: Event) => {
    const target = e.target
    if (target instanceof HTMLInputElement) {
      query.value = target.value
    }
  },
  onFocus: () => {
    handleInteraction(isOpen)
  },
  onClick: () => {
    handleInteraction(isOpen)
  },
  onBlur: () => {
    isFocused.value = false
  },
  'aria-invalid': !!props.errorMessage,
  'aria-describedby': props.errorMessage ? errorId : undefined,
})

// Optimized type guard using Set
function isTValue(val: unknown): val is TValue {
  return keySet.value.has(val)
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
    :name="props.name"
    as="div"
    class="group relative"
    nullable>
    <div
      :class="[
        'flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none',
        props.disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon
          class="w-6 text-text-secondary"
          aria-hidden="true" />
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

        <ComboboxLabel
          v-if="label"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500"
          :class="[
            isFloating
              ? 'top-1 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2 text-base',
          ]">
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </ComboboxLabel>
      </div>

      <ComboboxButton ref="comboButton" class="flex items-center pr-2">
        <ChevronDownIcon
          class="h-4 w-4 text-text-secondary"
          aria-hidden="true" />
      </ComboboxButton>
    </div>

    <p
      v-if="errorMessage"
      :id="errorId"
      class="mt-1 px-3 text-sm text-error-primary">
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
