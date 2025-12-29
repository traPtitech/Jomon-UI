<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import {
  ComboboxAnchor,
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

import type { Option } from './types'

type TValue = string | number

interface Props {
  options: Option<TValue>[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  resetOnSelect?: boolean
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
  resetOnSelect: true,
  name: '',
})

const model = defineModel<TValue[]>({ required: true })

const inputId = useId()
const errorId = `${inputId}-error`
const searchTerm = ref('')
const open = ref(false)
const isFocused = ref(false)

// Performance optimization: O(1) lookups
const optionMap = computed(() => new Map(props.options.map(o => [o.key, o])))
const keySet = computed(() => new Set<unknown>(props.options.map(o => o.key)))

const handleInputFocus = () => {
  open.value = true
  isFocused.value = true
}

const isFloating = computed(() => {
  return (
    isFocused.value || searchTerm.value.length > 0 || model.value.length > 0
  )
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

const getLabel = (key: TValue) => {
  return optionMap.value.get(key)?.label ?? String(key)
}

const removeTag = (key: TValue) => {
  if (props.disabled) return
  model.value = model.value.filter(v => v !== key)
}

/**
 * Type Guard for Array<TValue>
 */
function isTValueArray(val: unknown[]): val is TValue[] {
  const set = keySet.value
  return val.every(
    v => (typeof v === 'string' || typeof v === 'number') && set.has(v)
  )
}

const onUpdateModelValue = (val: unknown) => {
  if (Array.isArray(val) && isTValueArray(val)) {
    const isAdded = val.length > model.value.length
    model.value = val

    // Reset search term on selection if enabled
    if (isAdded && props.resetOnSelect) {
      searchTerm.value = ''
    }
  }
}

const handleInput = (e: Event) => {
  const target = e.target
  if (target instanceof HTMLInputElement) {
    searchTerm.value = target.value
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
    class="group relative"
    multiple>
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
        <ComboboxInput as-child>
          <input
            :id="inputId"
            class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
            :class="[
              label ? 'pt-6' : 'pt-2',
              props.disabled ? 'cursor-not-allowed' : '',
            ]"
            :placeholder="isFloating || !props.label ? placeholder : ''"
            :value="searchTerm"
            :aria-invalid="!!errorMessage"
            :aria-describedby="errorMessage ? errorId : undefined"
            @input="handleInput"
            @keydown.enter.prevent
            @focus="handleInputFocus"
            @blur="isFocused = false" />
        </ComboboxInput>

        <ComboboxLabel
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
        </ComboboxLabel>
      </div>

      <ComboboxTrigger class="flex items-center pr-2">
        <ChevronDownIcon
          class="h-4 w-4 text-text-secondary"
          aria-hidden="true" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <!-- Tags -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div
        v-for="key in model"
        :key="String(key)"
        class="flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-xs text-text-primary">
        {{ getLabel(key) }}
        <button
          type="button"
          :aria-label="`${getLabel(key)} を削除`"
          class="ml-1 rounded-full hover:bg-blue-100"
          @click.stop="removeTag(key)">
          <XMarkIcon class="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </div>

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
              :key="String(option.key)"
              :value="option.key"
              :disabled="!!option.disabled"
              class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm text-text-primary outline-none select-none data-highlighted:bg-blue-100 data-highlighted:text-blue-500">
              <div class="mr-2 flex h-4 w-4 items-center justify-center">
                <ComboboxItemIndicator>
                  <CheckIcon class="h-4 w-4" aria-hidden="true" />
                </ComboboxItemIndicator>
              </div>
              <span class="truncate">{{ option.label }}</span>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
