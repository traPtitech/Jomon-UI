<script setup lang="ts">
import { computed, useId } from 'vue'

import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { ComboboxRootProps } from 'reka-ui'
import {
  ComboboxAnchor,
  ComboboxContent,
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

import { useSearchSelectReka } from './composables/useSearchSelectReka'
import type { Option } from './types'
import { safeString } from './utils'

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

const {
  searchTerm,
  open,
  isFocused,
  isFloating,
  filteredOptions,
  getOption,
  getLabel,
} = useSearchSelectReka(
  computed(() => props.options),
  model,
  props.filterFunction
)

const removeTag = (key: TValue) => {
  if (props.disabled) return
  model.value = model.value.filter(v => v !== key)
}

// Manual selection handler to keep dropdown open for multiple selection
const handleSelect = (ev: CustomEvent) => {
  // We handle model updates manually to keep the dropdown open
  ev.preventDefault()

  if (props.disabled) return

  const val = ev.detail?.value
  // Validate existence using O(1) Map lookup
  const option = getOption(val)
  // Fix: Ensure we check both root disabled and option disabled
  if (!option || option.disabled) return

  const validKey = option.key

  if (model.value.includes(validKey)) {
    model.value = model.value.filter(v => v !== validKey)
  } else {
    model.value = [...model.value, validKey]
    if (props.resetOnSelect) {
      searchTerm.value = ''
    }
  }
}

// Simplified rootProps thanks to exactOptionalPropertyTypes: false
const rootProps = computed<Partial<ComboboxRootProps>>(() => ({
  disabled: props.disabled,
  required: props.required,
  ignoreFilter: true,
  resetSearchTermOnSelect: props.resetOnSelect,
  openOnFocus: true,
  openOnClick: true,
  name: props.name,
}))
</script>

<template>
  <ComboboxRoot
    :model-value="model"
    v-model:open="open"
    v-bind="rootProps"
    class="group relative"
    multiple>
    <ComboboxAnchor
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[
        props.disabled
          ? 'cursor-not-allowed bg-surface-secondary opacity-60'
          : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon
          class="w-6 text-text-secondary"
          aria-hidden="true" />
      </div>

      <div
        class="relative w-full"
        :class="[props.disabled ? 'pointer-events-none' : '']">
        <!-- Search input sync via v-model on ComboboxInput -->
        <ComboboxInput as-child v-model="searchTerm" :disabled="props.disabled">
          <input
            :id="inputId"
            class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
            :class="[
              label ? 'pt-6' : 'pt-2',
              props.disabled ? 'cursor-not-allowed' : '',
            ]"
            :placeholder="isFloating || !props.label ? placeholder : ''"
            :aria-label="label ?? placeholder ?? '検索'"
            :aria-invalid="!!errorMessage"
            :aria-describedby="errorMessage ? errorId : undefined"
            :aria-errormessage="errorMessage ? errorId : undefined"
            :disabled="props.disabled"
            @focus="isFocused = true"
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

      <ComboboxTrigger as-child :disabled="props.disabled">
        <button
          type="button"
          class="flex items-center pr-2"
          :class="[props.disabled ? 'cursor-not-allowed' : '']"
          :aria-label="label ? `${label}を開く` : '選択肢を開く'">
          <ChevronDownIcon
            class="h-4 w-4 text-text-secondary"
            aria-hidden="true" />
        </button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <!-- Tags -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div
        v-for="key in model"
        :key="safeString(key)"
        class="flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-xs text-text-primary">
        {{ getLabel(key) }}
        <button
          type="button"
          :disabled="props.disabled"
          :aria-label="`${getLabel(key)} を削除`"
          class="ml-1 rounded-full hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
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
          <!-- Manual control over empty state due to ignore-filter -->
          <div
            v-if="filteredOptions.length === 0"
            class="relative cursor-default px-2 py-1.5 text-sm text-gray-700 select-none">
            {{ props.noResultsText || '該当する項目がありません。' }}
          </div>

          <ComboboxGroup>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="option.key"
              :value="option.key"
              :text-value="option.label"
              :disabled="!!props.disabled || !!option.disabled"
              @select="handleSelect"
              class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm text-text-primary outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:not-data-disabled:bg-blue-100 data-highlighted:not-data-disabled:text-blue-500">
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
