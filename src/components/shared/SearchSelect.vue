<script setup lang="ts" generic="U extends string | null">
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'

import BaseTextInput from './BaseInput/BaseTextInput.vue'
import {
  type AllowCustom,
  useSearchSelectGeneric as useSearchSelect,
} from './composables/useSearchSelect'
import type { Option } from './types'

const props = withDefaults(
  defineProps<{
    options: Option<NonNullable<U>>[]
    label: string
    placeholder?: string
    allowCustom?: AllowCustom<NonNullable<U>>
    disabled?: boolean
    required?: boolean
  }>(),
  {
    placeholder: '検索',
    disabled: false,
    required: false,
  }
)

const emit = defineEmits<{
  (e: 'focus' | 'close'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()
const model = defineModel<U>({ required: true })

const {
  menuState,
  searchTerm,
  highlightedIndex,
  dropdownRef,
  filteredOptions,
  handleInputFocus,
  handleChange,
  handleKeyDown: baseHandleKeyDown,
} = useSearchSelect<NonNullable<U>>(props, emit, model)

const isCustomAllowed = (
  val: string,
  allowed: AllowCustom<NonNullable<U>> | undefined
): val is NonNullable<U> => {
  return (allowed ?? false) && typeof val === 'string'
}

const handleSelect = (selectedValue: NonNullable<U>) => {
  model.value = selectedValue
  const selectedOption = props.options.find(opt => opt.value === selectedValue)
  searchTerm.value = selectedOption?.key ?? selectedValue
  menuState.value = 'close'
}

const handleAddCustom = () => {
  const option = props.options.find(opt => opt.value === searchTerm.value)
  if (option) {
    handleSelect(option.value)
  } else if (
    isCustomAllowed(searchTerm.value, props.allowCustom) &&
    searchTerm.value &&
    !props.options.find(opt => opt.value === searchTerm.value)
  ) {
    handleSelect(searchTerm.value)
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  baseHandleKeyDown(
    e,
    handleSelect,
    props.allowCustom ? handleAddCustom : undefined
  )
}
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <div class="relative">
      <BaseTextInput
        v-model="searchTerm"
        :label="label"
        :class="['pr-8', disabled && 'cursor-not-allowed opacity-50']"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @focus="handleInputFocus"
        @input="handleChange"
        @keydown="handleKeyDown">
        <MagnifyingGlassIcon class="ml-3 w-6 text-text-secondary" />
      </BaseTextInput>
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-2"
        :disabled="disabled"
        @click="
          !disabled && menuState === 'close'
            ? (menuState = 'presearch')
            : (menuState = 'close')
        ">
        <ChevronDownIcon
          :class="[
            'h-4 w-4 text-text-secondary transition-transform',
            menuState !== 'close' && 'rotate-180',
          ]" />
      </button>
    </div>

    <div
      v-if="menuState !== 'close'"
      class="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
      <!-- Options list -->
      <div class="max-h-[200px] overflow-auto p-1">
        <div v-if="filteredOptions.length === 0" class="px-2 py-1.5 text-sm">
          {{ searchTerm ? '該当する項目がありません' : '項目がありません' }}
        </div>
        <button
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          type="button"
          :class="[
            'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none',
            'hover:bg-blue-100 hover:text-blue-500',
            highlightedIndex === index && 'bg-blue-100 text-blue-500',
            option.disabled && 'cursor-not-allowed opacity-50',
            model === option.value && 'bg-blue-100',
          ]"
          :disabled="option.disabled"
          @click="!option.disabled && handleSelect(option.value)">
          <span class="truncate">{{ option.key }}</span>
          <CheckIcon v-if="model === option.value" class="ml-auto h-4 w-4" />
        </button>

        <!-- Add custom option -->
        <button
          v-if="
            allowCustom &&
            searchTerm &&
            !options.find(opt => opt.value === searchTerm)
          "
          type="button"
          :class="[
            'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none',
            'border-t hover:bg-blue-100 hover:text-blue-500',
          ]"
          @click="handleAddCustom">
          <PlusIcon class="mr-2 h-4 w-4" />
          <span>"{{ searchTerm }}" を追加</span>
        </button>
      </div>
    </div>
  </div>
</template>
