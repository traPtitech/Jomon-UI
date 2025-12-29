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
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  Label,
} from 'reka-ui'

import type { Option } from './types'

type TValue = string | number

// Manual type definition for Reka UI event if not exported
type ComboboxItemSelectEventWrapper<T> = CustomEvent<{
  value: T
  originalEvent: Event
}>

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
  // name default is undefined
})

const model = defineModel<TValue[]>({ required: true })

const inputId = useId()
const errorId = `${inputId}-error`
const searchTerm = ref('')
const open = ref(false)
const isFocused = ref(false)

// Performance optimization: O(1) lookups
const optionMap = computed(() => new Map(props.options.map(o => [o.key, o])))
// Use Set<unknown> to allow checking mixed types without casting
const keySet = computed(() => new Set<unknown>(props.options.map(o => o.key)))

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
 * Type Guard: Verifies that the value is a string or number AND exists in the options.
 */
function isTValue(val: unknown): val is TValue {
  return (
    (typeof val === 'string' || typeof val === 'number') &&
    keySet.value.has(val)
  )
}

// Manual selection handler to keep dropdown open
const handleSelect = (ev: ComboboxItemSelectEventWrapper<TValue>) => {
  // Prevent default behavior (closing and auto-update)
  ev.preventDefault()

  const val = ev.detail.value

  // Use Type Guard to ensure safety. This handles undefined/null checks too.
  if (!isTValue(val)) return

  if (model.value.includes(val)) {
    model.value = model.value.filter(v => v !== val)
  } else {
    model.value = [...model.value, val]
    // Manual reset is needed here because we prevented default behavior
    if (props.resetOnSelect) {
      searchTerm.value = ''
    }
  }
}

// Workaround for strict prop types in Reka UI
const rootProps = computed(() => {
  const p: Record<string, unknown> = {
    disabled: props.disabled,
    required: props.required,
    ignoreFilter: true,
    resetSearchTermOnSelect: props.resetOnSelect,
    openOnFocus: true,
    openOnClick: true,
  }
  if (props.name) {
    p.name = props.name
  }
  return p
})
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
        props.disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon
          class="w-6 text-text-secondary"
          aria-hidden="true" />
      </div>

      <div class="relative w-full">
        <!-- 
          Removed @keydown.enter.prevent to allow native selection behavior.
          Using standard Combobox features for open/close behavior.
        -->
        <ComboboxInput as-child v-model="searchTerm">
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

    <!-- Tags -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div
        v-for="key in model"
        :key="String(key)"
        class="flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-xs text-text-primary">
        {{ getLabel(key) }}
        <button
          type="button"
          :disabled="props.disabled"
          :aria-label="`${getLabel(key)} を削除`"
          class="ml-1 rounded-full hover:bg-blue-100 disabled:opacity-50 disabled:hover:bg-transparent"
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
              :key="option.key"
              :value="option.key"
              :disabled="!!option.disabled"
              @select="handleSelect"
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
