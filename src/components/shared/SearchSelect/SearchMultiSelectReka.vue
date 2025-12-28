<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, watch } from 'vue'

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

import type { SearchSelectCommonProps, SearchSelectEmit } from './types'

const props = withDefaults(
  defineProps<SearchSelectCommonProps<TValue> & { modelValue: TValue[] }>(),
  {
    placeholder: '検索',
    disabled: false,
    required: false,
    resetOnSelect: true,
    errorMessage: undefined,
    modelValue: () => [],
  }
)

const emit = defineEmits<SearchSelectEmit<TValue[]>>()

const localModel = computed({
  get: () => props.modelValue,
  set: val => {
    const value = val || []
    emit('update:modelValue', value)
  },
})

const searchTerm = ref('')
const open = ref(false)
const isFocused = ref(false)

const handleInputFocus = () => {
  open.value = true
  isFocused.value = true
}

const isFloating = computed(() => {
  return (
    isFocused.value ||
    searchTerm.value.length > 0 ||
    localModel.value.length > 0
  )
})

const filteredOptions = computed(() => {
  const term = searchTerm.value.toLowerCase()
  const filterFn = props.filterFunction
   
  if (filterFn) {
    return props.options.filter(o => filterFn(o, searchTerm.value))
  }
  return props.options.filter(o => o.label.toLowerCase().includes(term))
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

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    const oldLength = oldVal.length

    if (props.resetOnSelect && newVal.length > oldLength) {
      searchTerm.value = ''
    }
  },
  { deep: true }
)
</script>

<template>
  <ComboboxRoot
    v-model="localModel"
    v-model:open="open"
    :disabled="disabled"
    class="group relative"
    multiple
    nullable>
    <ComboboxAnchor
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[
        disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <ComboboxInput
          class="w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
          :class="[
            label ? 'pt-6' : 'pt-2',
            disabled ? 'cursor-not-allowed' : '',
          ]"
          :placeholder="isFloating ? placeholder : ''"
          v-model="searchTerm"
          @keydown.enter.prevent
          @focus="handleInputFocus"
          @blur="isFocused = false" />

        <ComboboxLabel
          v-if="label"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out"
          :class="[
            isFloating
              ? 'top-1 text-xs font-medium text-blue-500'
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
    <div v-if="localModel.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div
        v-for="key in localModel"
        :key="String(key)"
        class="flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-xs text-text-primary">
        {{ getLabel(key) }}
        <button
          type="button"
          class="ml-1 rounded-full hover:bg-blue-100"
          @click.stop="removeTag(key)">
          <XMarkIcon class="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </div>

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
            {{ noResultsText || '該当する項目がありません。' }}
          </ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="String(option.key)"
              :value="option.key"
              :disabled="option.disabled"
              class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm text-text-primary outline-none select-none data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-500">
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
