<script setup lang="ts" generic="T extends string | number">
import { computed, ref, useId, watch } from 'vue'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
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

import OpenStateEmitter from './OpenStateEmitter.vue'
import { useSearchSelect } from './composables/useSearchSelect'
import type { SearchSelectOption } from './types'

export interface SearchMultiSelectProps<T extends string | number> {
  options: SearchSelectOption<T>[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  resetOnSelect?: boolean
  name?: string
  noResultsText?: string
  errorMessage?: string
  filterFunction?: (option: SearchSelectOption<T>, query: string) => boolean
}

const props = withDefaults(defineProps<SearchMultiSelectProps<T>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const model = defineModel<T[]>({ required: true })

const inputId = useId()
const errorId = `${inputId}-error`
const buttonRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const { searchTerm, isFocused, isFloating, filteredOptions, getLabel } =
  useSearchSelect(
    computed(() => props.options),
    model,
    props.filterFunction,
    isOpen
  )

// Implement resetOnSelect: Clear search term when a new item is added
watch(
  () => model.value.length,
  (newLen, oldLen) => {
    if (props.resetOnSelect && newLen > oldLen) {
      searchTerm.value = ''
    }
  }
)

const removeTag = (key: T) => {
  if (props.disabled) return
  model.value = model.value.filter(v => v !== key)
}

const onOpen = () => {
  isOpen.value = true
}
const onClose = () => {
  isOpen.value = false
  emit('close')
}

defineOptions({
  name: 'SearchMultiSelect',
})
</script>

<template>
  <Combobox
    v-model="model"
    :name="name"
    :disabled="disabled"
    as="div"
    class="group relative"
    multiple
    v-slot="{ open }">
    <OpenStateEmitter :open="open" @open="onOpen" @close="onClose" />
    <div
      class="flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none"
      :class="[
        props.disabled
          ? 'cursor-not-allowed bg-surface-secondary opacity-60'
          : 'bg-white',
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
        <ComboboxInput as="template" @change="searchTerm = $event.target.value">
          <input
            v-model="searchTerm"
            @focus="!open && buttonRef?.click()"
            @click="!open && buttonRef?.click()"
            :id="inputId"
            class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
            :class="[
              label ? 'pt-6' : 'pt-2',
              props.disabled ? 'cursor-not-allowed' : '',
            ]"
            :placeholder="isFloating || !props.label ? placeholder : ''"
            :aria-label="!label ? (placeholder ?? '検索') : undefined"
            :aria-invalid="!!errorMessage"
            :aria-describedby="errorMessage ? errorId : undefined"
            :aria-errormessage="errorMessage ? errorId : undefined"
            autocomplete="off" />
        </ComboboxInput>

        <label
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
        </label>
      </div>

      <ComboboxButton as="template">
        <button
          ref="buttonRef"
          type="button"
          class="flex items-center pr-2"
          :class="[props.disabled ? 'cursor-not-allowed' : '']"
          :aria-label="label ? `${label}を開く` : '選択肢を開く'">
          <ChevronDownIcon
            class="h-4 w-4 text-text-secondary"
            aria-hidden="true" />
        </button>
      </ComboboxButton>
    </div>

    <!-- Tags -->
    <div v-if="model.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div
        v-for="key in model"
        :key="key"
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

    <TransitionRoot
      leave="transition ease-in duration-100"
      leave-from="opacity-100"
      leave-to="opacity-0"
      @after-leave="searchTerm = ''">
      <ComboboxOptions
        class="absolute z-50 mt-1 box-border max-h-60 w-full overflow-auto rounded-md border bg-white p-1 shadow-lg focus:outline-none">
        <div
          v-if="filteredOptions.length === 0 && searchTerm !== ''"
          class="relative cursor-default px-2 py-1.5 text-sm text-gray-700 select-none">
          {{ props.noResultsText || '該当する項目がありません。' }}
        </div>

        <ComboboxOption
          v-for="option in filteredOptions"
          as="template"
          :key="option.key"
          :value="option.key"
          :disabled="!!option.disabled"
          v-slot="{ selected, active, disabled: optionDisabled }">
          <li
            class="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm select-none"
            :class="{
              'bg-blue-100 text-blue-500': active && !optionDisabled,
              'text-text-primary': !active && !optionDisabled,
              'cursor-not-allowed opacity-40': optionDisabled,
            }">
            <div class="mr-2 flex h-4 w-4 items-center justify-center">
              <span v-if="selected">
                <CheckIcon class="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <span
              class="flex-1 truncate"
              :class="{ 'font-medium': selected, 'font-normal': !selected }">
              {{ option.label }}
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
</template>
