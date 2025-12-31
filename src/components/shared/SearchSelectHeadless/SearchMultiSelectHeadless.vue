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
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import type { Option } from './types'

// defineModel handles modelValue, so it is removed from defineProps.
const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    placeholder: '検索',
    disabled: false,
    required: false,
    resetOnSelect: true,
    name: '',
  }
)

const model = defineModel<TValue[]>({ required: true })

const inputId = useId()
const errorId = `${inputId}-error`
const query = ref('')
const isFocused = ref(false)

// Performance optimization: O(1) lookups
const optionMap = computed(() => new Map(props.options.map(o => [o.key, o])))
const keySet = computed(() => new Set<unknown>(props.options.map(o => o.key)))

const comboButton = ref<InstanceType<typeof ComboboxButton> | null>(null)

// Workaround for lack of "openOnFocus" prop in Headless UI Vue v1.
const forceOpen = () => {
  if (comboButton.value?.$el instanceof HTMLElement) {
    comboButton.value.$el.click()
  }
}

const isFloating = computed(() => {
  return isFocused.value || query.value.length > 0 || model.value.length > 0
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

const getLabel = (key: TValue) => {
  return optionMap.value.get(key)?.label ?? String(key)
}

const removeTag = (key: TValue) => {
  if (props.disabled) return
  model.value = model.value.filter(v => v !== key)
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
function isTValueArray(val: unknown[]): val is TValue[] {
  const set = keySet.value
  return val.every(
    v => typeof v === 'string' || (typeof v === 'number' && set.has(v))
  )
}

const onUpdateModel = (val: unknown) => {
  if (Array.isArray(val) && isTValueArray(val)) {
    const isAdded = val.length > model.value.length
    model.value = val
    if (isAdded && props.resetOnSelect) {
      query.value = ''
    }
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
    multiple>
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
          v-bind="inputAttrs(open)"
          :display-value="() => query" />

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
            <div class="mr-2 flex h-4 w-4 items-center justify-center">
              <CheckIcon v-if="selected" class="h-4 w-4" aria-hidden="true" />
            </div>
            <span class="truncate">{{ option.label }}</span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
