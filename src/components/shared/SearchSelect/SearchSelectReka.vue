<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  Label,
} from 'reka-ui'

import type { Option } from './types'

// 型を固定してマクロの解析負荷を下げる
type TValue = string | number

interface Props {
  options: Option<TValue>[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  name?: string
  noResultsText?: string
  errorMessage?: string
  filterFunction?: (option: Option<TValue>, query: string) => boolean
}

// defineModel handles modelValue, so it is removed from defineProps.
const props = withDefaults(defineProps<Props>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  name: '', // Default to empty string to avoid undefined
})

const model = defineModel<TValue | null>({ required: true })

const inputId = useId()
const errorId = `${inputId}-error`
const searchTerm = ref('')
const open = ref(false)
const isFocused = ref(false)

// Performance optimization: O(1) lookups
const optionMap = computed(() => new Map(props.options.map(o => [o.key, o])))
// Use Set<unknown> to allow checking mixed types without casting
const keySet = computed(() => new Set<unknown>(props.options.map(o => o.key)))

const handleInputFocus = () => {
  open.value = true
  isFocused.value = true
}

const isFloating = computed(() => {
  return isFocused.value || searchTerm.value.length > 0 || model.value !== null
})

const filteredOptions = computed(() => {
  if (searchTerm.value === '') return props.options

  const term = searchTerm.value.toLowerCase()
  const filterFn = props.filterFunction
  if (filterFn) {
    return props.options.filter(o => filterFn(o, searchTerm.value))
  }
  return props.options.filter(o => o.label.toLowerCase().includes(term))
})

const getDisplayValue = (val: unknown): string => {
  if (val === null || val === undefined) return ''
  // Use Type Guard instead of cast
  if (isTValue(val)) {
    return optionMap.value.get(val)?.label ?? String(val)
  }
  return ''
}

/**
 * Type Guard: Verifies that the value is a string or number AND exists in the options.
 * This guarantees type safety at runtime.
 */
function isTValue(val: unknown): val is TValue {
  return (
    (typeof val === 'string' || typeof val === 'number') &&
    keySet.value.has(val)
  )
}

const onUpdateModelValue = (val: unknown) => {
  if (val === null) {
    model.value = null
  } else if (isTValue(val)) {
    // TypeScript now knows val is TValue
    model.value = val
  }
}
</script>

<template>
  <ComboboxRoot
    :model-value="model"
    @update:model-value="onUpdateModelValue"
    v-model:open="open"
    :disabled="props.disabled"
    :name="props.name"
    :required="props.required"
    :ignore-filter="true"
    class="group relative">
    <ComboboxAnchor
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[
        props.disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon
          class="w-6 text-text-secondary"
          aria-hidden="true" />
      </div>

      <div class="relative w-full">
        <!-- 
          In Reka UI v2, search input value is managed via v-model on ComboboxInput.
          The 'displayValue' prop is also placed on ComboboxInput.
        -->
        <ComboboxInput
          as-child
          v-model="searchTerm"
          :display-value="getDisplayValue">
          <input
            :id="inputId"
            class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
            :class="[
              label ? 'pt-6' : 'pt-2',
              props.disabled ? 'cursor-not-allowed' : '',
            ]"
            :placeholder="isFloating || !props.label ? placeholder : ''"
            :aria-invalid="!!errorMessage"
            :aria-describedby="errorMessage ? errorId : undefined"
            @keydown.enter.prevent
            @focus="handleInputFocus"
            @blur="isFocused = false" />
        </ComboboxInput>

        <Label
          v-if="label"
          :for="inputId"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out"
          :class="[
            isFloating
              ? 'top-1 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2 text-base',
            isFocused ? 'text-blue-500' : '',
          ]">
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </Label>
      </div>

      <ComboboxTrigger as-child>
        <button
          type="button"
          class="flex items-center pr-2"
          :aria-label="label ? `${label}を開く` : '選択肢を開く'">
          <ChevronDownIcon
            class="h-4 w-4 text-text-secondary"
            aria-hidden="true" />
        </button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <p
      v-if="errorMessage"
      :id="errorId"
      class="mt-1 px-3 text-sm text-error-primary">
      {{ errorMessage }}
    </p>

    <ComboboxPortal>
      <ComboboxContent
        class="absolute z-50 mt-1 box-border max-h-[200px] w-full overflow-auto rounded-md border bg-white p-1 shadow-lg focus:outline-none"
        :side-offset="5"
        position="popper"
        align="start"
        :style="{
          width: 'var(--reka-combobox-trigger-width)',
          minWidth: 'var(--reka-combobox-trigger-width)',
        }">
        <ComboboxViewport>
          <ComboboxEmpty
            class="relative cursor-default px-2 py-1.5 text-sm text-gray-700 select-none">
            {{ props.noResultsText || '該当する項目がありません。' }}
          </ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="option.key"
              :value="option.key"
              :disabled="!!option.disabled"
              class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm text-text-primary outline-none select-none data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-500">
              <span class="flex-1 truncate">{{ option.label }}</span>

              <ComboboxItemIndicator class="ml-auto h-4 w-4 text-text-primary">
                <CheckIcon class="h-4 w-4" aria-hidden="true" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
