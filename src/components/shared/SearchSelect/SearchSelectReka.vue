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
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
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
  noResultsText?: string
  errorMessage?: string
  filterFunction?: (option: Option<TValue>, query: string) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
})

const model = defineModel<TValue | null>({ required: true })

const inputId = useId()
const searchTerm = ref('')
const open = ref(false)
const isFocused = ref(false)

const handleInputFocus = () => {
  open.value = true
  isFocused.value = true
}

const isFloating = computed(() => {
  return isFocused.value || searchTerm.value.length > 0 || model.value !== null
})

const filteredOptions = computed(() => {
  const options = props.options
  const selectedOption = options.find(o => o.key === model.value)
  if (selectedOption && searchTerm.value === selectedOption.label) {
    return options
  }
  if (searchTerm.value === '') return options
  const term = searchTerm.value.toLowerCase()
  const filterFn = props.filterFunction
  if (filterFn) {
    return options.filter(o => filterFn(o, searchTerm.value))
  }
  return options.filter(o => o.label.toLowerCase().includes(term))
})

const getDisplayValue = (val: unknown): string => {
  if (val === null || val === undefined) return ''
  // 型ガードで TValue であることを保証
  if (typeof val === 'string' || typeof val === 'number') {
    return props.options.find(o => o.key === val)?.label ?? ''
  }
  return ''
}

const onUpdateModelValue = (val: unknown) => {
  // 型ガードで TValue | null であることを保証
  if (val === null || typeof val === 'string' || typeof val === 'number') {
    model.value = val
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
    class="group relative">
    <ComboboxAnchor
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[
        props.disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <ComboboxInput as-child :display-value="getDisplayValue">
          <input
            :id="inputId"
            class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
            :class="[
              label ? 'pt-6' : 'pt-2',
              props.disabled ? 'cursor-not-allowed' : '',
            ]"
            :placeholder="isFloating ? placeholder : ''"
            :value="searchTerm"
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
