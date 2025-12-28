<script setup lang="ts" generic="TValue extends string | number">
import { computed, ref, watch } from 'vue'

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

import type {
  SearchSelectCommonProps,
  SearchSelectEmit,
} from './types'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue> & { modelValue: TValue[] }>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: true,
  errorMessage: undefined,
  modelValue: () => []
})

const emit = defineEmits<SearchSelectEmit<TValue[]>>()

const comboButton = ref<InstanceType<typeof ComboboxButton> | null>(null)
const forceOpen = () => {
  if (comboButton.value?.$el) {
    comboButton.value.$el.click()
  }
}

const localValue = ref<TValue[]>([])

watch(() => props.modelValue, (val) => {
  localValue.value = val
}, { immediate: true })

watch(localValue, (val) => {
  emit('update:modelValue', val)
})

const query = ref('')
const isFocused = ref(false)

const isFloating = computed(() => {
  return isFocused.value || query.value.length > 0 || localValue.value.length > 0
})

const filteredOptions = computed(() => {
  if (query.value === '') return props.options
  const term = query.value.toLowerCase()
  if (props.filterFunction) {
    return props.options.filter(o => props.filterFunction!(o, query.value))
  }
  return props.options.filter(o => o.label.toLowerCase().includes(term))
})

const getLabel = (key: TValue) => {
  const option = props.options.find(o => o.key === key)
  return option ? option.label : String(key)
}

const removeTag = (key: TValue) => {
  if (props.disabled) return
  localValue.value = localValue.value.filter(v => v !== key)
}

watch(localValue, () => {
  if (props.resetOnSelect) {
    query.value = ''
  }
})
</script>

<template>
  <Combobox
    v-model="localValue"
    :disabled="disabled"
    as="div"
    class="relative group"
    multiple
    nullable
  >
    <div
      :class="[
        'flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none',
        disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]"
    >
      <div class="pl-3 flex items-center justify-center">
         <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <ComboboxInput
          class="peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none text-base text-text-primary"
          :class="[label ? 'pt-6' : 'pt-2', disabled ? 'cursor-not-allowed' : '']"
          :placeholder="isFloating ? placeholder : ''"
          @change="query = $event.target.value"
          @focus="isFocused = true; forceOpen()"
          @blur="isFocused = false"
          :display-value="() => query" 
        />
        
        <label
          v-if="label"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500"
          :class="[
            isFloating
              ? 'top-1 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2 text-base'
          ]"
        >
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </label>
      </div>

      <ComboboxButton
        ref="comboButton"
        class="flex items-center pr-2"
      >
        <ChevronDownIcon class="h-4 w-4 text-text-secondary" aria-hidden="true" />
      </ComboboxButton>
    </div>

    <!-- Tags -->
    <div v-if="localValue.length > 0" class="mt-2 flex flex-wrap gap-1">
      <div
        v-for="key in localValue"
        :key="String(key)"
        class="flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-xs text-text-primary"
      >
        {{ getLabel(key) }}
        <button
          type="button"
          class="ml-1 rounded-full hover:bg-blue-100"
          @click.stop="removeTag(key)"
        >
          <XMarkIcon class="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 px-3 text-sm text-error-primary">
      {{ errorMessage }}
    </p>

    <TransitionRoot
      leave="transition ease-in duration-100"
      leave-from="opacity-100"
      leave-to="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions
        class="absolute z-50 mt-1 w-full overflow-auto rounded-md border bg-white shadow-lg max-h-[200px] p-1 focus:outline-none"
      >
        <div
          v-if="filteredOptions.length === 0 && query !== ''"
          class="relative cursor-default select-none px-2 py-1.5 text-sm text-gray-700"
        >
          {{ noResultsText || '該当する項目がありません。' }}
        </div>

        <ComboboxOption
          v-for="option in filteredOptions"
          as="template"
          :key="String(option.key)"
          :value="option.key"
          :disabled="option.disabled"
          v-slot="{ selected, active, disabled }"
        >
          <li
            class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none"
            :class="{
              'bg-blue-100 text-blue-500': active,
              'text-text-primary': !active,
              'bg-blue-50': selected && !active,
              'cursor-not-allowed opacity-50': disabled
            }"
          >
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