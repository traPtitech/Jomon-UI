<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, watch } from 'vue'

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

import type { SearchSelectCommonProps, SearchSelectEmit } from './types'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue> & { modelValue: TValue | null }>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: false,
  errorMessage: undefined,
  modelValue: null
})

const emit = defineEmits<SearchSelectEmit<TValue | null>>()

const localModel = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
})

const searchTerm = ref('')
const open = ref(false)
const isFocused = ref(false)

const handleInputFocus = () => {
  open.value = true
  isFocused.value = true
}

const isFloating = computed(() => {
  return isFocused.value || searchTerm.value.length > 0 || !!localModel.value
})

const filteredOptions = computed(() => {
  const selectedOption = props.options.find(o => o.key === localModel.value)
  if (selectedOption && searchTerm.value === selectedOption.label) {
    return props.options
  }
  if (searchTerm.value === '') return props.options
  const term = searchTerm.value.toLowerCase()
  if (props.filterFunction) {
    return props.options.filter(o => props.filterFunction!(o, searchTerm.value))
  }
  return props.options.filter(o => o.label.toLowerCase().includes(term))
})
</script>

<template>
  <ComboboxRoot
    v-model="localModel"
    v-model:open="open"
    :disabled="disabled"
    class="relative group"
    nullable
  >
    <ComboboxAnchor
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white']"
    >
      <div class="pl-3 flex items-center justify-center">
         <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <ComboboxInput
          class="w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none text-base text-text-primary"
          :class="[label ? 'pt-6' : 'pt-2', disabled ? 'cursor-not-allowed' : '']"
          :placeholder="isFloating ? placeholder : ''"
          v-model="searchTerm"
          :display-value="(val: any) => options.find(o => o.key === val)?.label ?? ''"
          @keydown.enter.prevent
          @focus="handleInputFocus"
          @blur="isFocused = false"
        />
        
        <ComboboxLabel
          v-if="label"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out"
          :class="[
            isFloating
              ? 'top-1 text-xs font-medium text-blue-500' // Added blue-500 for active state check? Or rely on peer-focus? Reka Label doesn't detect peer focus easily without CSS.
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
        class="box-border absolute z-50 mt-1 w-full overflow-auto rounded-md border bg-white shadow-lg max-h-[200px] p-1 focus:outline-none"
        :side-offset="5"
        position="popper"
        align="start"
        :style="{ width: 'var(--reka-combobox-trigger-width)', minWidth: 'var(--reka-combobox-trigger-width)' }"
      >
        <ComboboxViewport>
          <ComboboxEmpty class="relative cursor-default select-none px-2 py-1.5 text-sm text-gray-700">
             {{ noResultsText || '該当する項目がありません。' }}
          </ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="String(option.key)"
              :value="option.key"
              :disabled="option.disabled"
              class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-500 text-text-primary"
            >
              <span class="truncate flex-1">{{ option.label }}</span>
              
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