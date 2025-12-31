<script setup lang="ts" generic="T extends AcceptableValue = string | number">
import { computed, useId, watch } from 'vue'

import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
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
import type {
  AcceptableValue,
  RekaOption,
} from './composables/useSearchSelectReka'
import { safeString } from './utils'

export interface SearchSelectRekaProps<T extends AcceptableValue> {
  options: RekaOption<T>[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  name?: string
  noResultsText?: string
  errorMessage?: string
  filterFunction?: (option: RekaOption<T>, query: string) => boolean
}

const props = withDefaults(defineProps<SearchSelectRekaProps<T>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
})

const model = defineModel<T | null>({ required: true })

const inputId = useId()
const errorId = `${inputId}-error`

const {
  searchTerm,
  open,
  isFocused,
  isFloating,
  filteredOptions,
  getOption,
  isTValue,
} = useSearchSelectReka(
  computed(() => props.options),
  model,
  props.filterFunction
)

// Ensure query is cleared when opening.
watch(open, isOpen => {
  if (isOpen) {
    searchTerm.value = ''
  }
})

/**
 * Robust Display Value Logic: Used by Reka UI when in Uncontrolled mode (menu closed).
 * Returns the human-readable label of the selected item.
 */
const getDisplayValue = (val: unknown): string => {
  // If the dropdown is open, we are in "Search Mode".
  if (open.value) {
    return searchTerm.value
  }

  // If closed, we are in "Display Mode".
  const option = getOption(val)
  if (option) return option.label

  if (typeof val === 'string' || typeof val === 'number') {
    return safeString(val)
  }
  return val != null ? '[Object]' : ''
}

const onUpdateModelValue = (val: unknown) => {
  if (val == null) {
    model.value = null
    return
  }
  if (isTValue(val)) {
    model.value = val
  }
}

// Simplified rootProps thanks to exactOptionalPropertyTypes: false
const rootProps = computed<Partial<ComboboxRootProps>>(() => ({
  disabled: props.disabled,
  required: props.required,
  ignoreFilter: true,
  openOnFocus: true,
  openOnClick: true,
  resetSearchTermOnSelect: true,
  name: props.name,
}))
</script>

<template>
  <ComboboxRoot
    :model-value="model ?? undefined"
    @update:model-value="onUpdateModelValue"
    v-model:open="open"
    v-bind="rootProps"
    class="group relative">
    <ComboboxAnchor as-child>
      <div
        class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
        :class="[
          props.disabled ? 'bg-surface-secondary opacity-60' : 'bg-white',
        ]"
        @focusin="isFocused = true"
        @focusout="isFocused = false">
        <div class="flex items-center justify-center pl-3">
          <MagnifyingGlassIcon
            class="w-6 text-text-secondary"
            aria-hidden="true" />
        </div>

        <div
          class="relative w-full"
          :class="[props.disabled ? 'pointer-events-none' : '']">
          <!-- 
            Leveraging exactOptionalPropertyTypes: false to toggle modes elegantly.
            - When OPEN: model-value is bound to searchTerm (Controlled).
            - When CLOSED: display-value is bound to getDisplayValue (Uncontrolled).
          -->
          <ComboboxInput
            as-child
            :model-value="open ? searchTerm : undefined"
            @update:model-value="val => (searchTerm = val)"
            :display-value="open ? undefined : getDisplayValue"
            :disabled="props.disabled">
            <input
              :id="inputId"
              class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
              :class="[
                label ? 'pt-6' : 'pt-2',
                props.disabled ? 'cursor-not-allowed' : '',
              ]"
              :placeholder="isFloating || !props.label ? placeholder : ''"
              :aria-label="label ?? placeholder ?? '選択'"
              :aria-invalid="!!errorMessage"
              :aria-describedby="errorMessage ? errorId : undefined"
              :aria-errormessage="errorMessage ? errorId : undefined" />
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
      </div>
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
          <div
            v-if="filteredOptions.length === 0"
            class="relative cursor-default px-2 py-1.5 text-sm text-gray-700 select-none">
            {{ props.noResultsText || '該当する項目がありません。' }}
          </div>

          <ComboboxGroup>
            <ComboboxItem
              v-for="option in filteredOptions"
              :key="String(option.key)"
              :value="option.key"
              :text-value="option.label"
              :disabled="!!option.disabled"
              class="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm text-text-primary outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:not-data-disabled:bg-blue-100 data-highlighted:not-data-disabled:text-blue-500">
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
