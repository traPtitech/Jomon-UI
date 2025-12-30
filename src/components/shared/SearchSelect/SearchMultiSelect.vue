<script setup lang="ts" generic="TValue extends string | number">
import { computed, useId } from 'vue'

import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import { useSearchSelectMachine } from './composables/useSearchSelectMachine'
// Primitives removed
// import SearchSelectPrimitiveInput from './primitives/SearchSelectPrimitiveInput.vue'
// import SearchSelectPrimitiveItem from './primitives/SearchSelectPrimitiveItem.vue'
// import SearchSelectPrimitiveList from './primitives/SearchSelectPrimitiveList.vue'
// import SearchSelectPrimitiveRoot from './primitives/SearchSelectPrimitiveRoot.vue'
import type { SearchSelectCommonProps, SearchSelectEmit } from './types'
import { safeBind, safeString } from './utils'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: true,
  errorMessage: undefined,
})

const emit = defineEmits<SearchSelectEmit<TValue[]>>()
const model = defineModel<TValue[]>({ required: true })

const id = useId()
const errorId = `${id}-error`

const { api, filteredOptions } = useSearchSelectMachine<TValue>(
  {
    id,
    options: computed(() => props.options),
    multiple: true,
    disabled: computed(() => props.disabled),
    placeholder: computed(() => props.placeholder),
    modelValue: computed(() => model.value),
    filterFunction: props.filterFunction,
    resetOnSelect: computed(() => props.resetOnSelect),
  },
  (event, value) => {
    if (event === 'close') {
      emit('close')
      return
    }
    if (Array.isArray(value)) {
      emit(event, value)
    }
  }
)

const machineApi = computed(() => api.value)

// Option Map for Tags Loop
const optionMap = computed(() => {
  const map = new Map<string, string>()
  for (const option of props.options) {
    map.set(safeString(option.key), option.label)
  }
  return map
})

const selectedKeysSet = computed(() => {
  return new Set(machineApi.value.value)
})

// Remove tag handler
const removeItem = (valueStr: string) => {
  if (props.disabled) return
  api.value.clearValue(valueStr)
}

// Floating Label Condition
const isFloating = computed(() => {
  const apiVal = machineApi.value
  return (
    apiVal.inputValue.length > 0 || apiVal.value.length > 0 || apiVal.focused
  )
})
const handleInputKeydown = (e: KeyboardEvent) => {
  emit('keydown', e)
  if (props.disabled || e.isComposing) return

  // Backspace deletion for MultiSelect
  if (e.key === 'Backspace' && machineApi.value.inputValue === '') {
    const currentValues = machineApi.value.value
    if (currentValues.length > 0) {
      const lastKeyStr = currentValues[currentValues.length - 1]
      api.value.clearValue(lastKeyStr)
    }
  }
}
</script>

<template>
  <div
    v-bind="safeBind(machineApi.getRootProps())"
    class="group relative w-full">
    <!-- Input Wrapper -->
    <div
      v-bind="safeBind(machineApi.getControlProps())"
      :class="[
        'flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none',
        disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]">
      <div class="flex items-center justify-center pl-3">
        <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <input
          v-bind="safeBind(machineApi.getInputProps())"
          class="peer w-full border-none bg-transparent px-3 pb-2 text-base text-text-primary ring-0 outline-none"
          :class="[
            label ? 'pt-6' : 'pt-2',
            disabled ? 'cursor-not-allowed' : '',
          ]"
          :placeholder="isFloating ? placeholder : ''"
          :aria-invalid="!!errorMessage"
          :aria-describedby="errorMessage ? errorId : undefined"
          @keydown="handleInputKeydown" />

        <label
          v-if="label"
          :for="id"
          v-bind="safeBind(machineApi.getLabelProps())"
          class="pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500"
          :class="[
            isFloating
              ? 'top-1 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2 text-base',
          ]">
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </label>
      </div>

      <button
        type="button"
        v-bind="safeBind(machineApi.getTriggerProps())"
        class="flex items-center pr-2">
        <ChevronUpDownIcon
          class="h-4 w-4 text-text-secondary"
          aria-hidden="true" />
      </button>
    </div>

    <!-- Tags -->
    <div
      v-if="machineApi.value && machineApi.value.length > 0"
      class="mt-2 flex flex-wrap gap-1"
      role="group"
      aria-label="Selection">
      <div
        v-for="valStr in machineApi.value"
        :key="valStr"
        class="flex items-center rounded-sm bg-surface-secondary px-2 py-1 text-xs text-text-primary">
        {{ optionMap.get(valStr) ?? valStr }}
        <button
          type="button"
          :aria-label="`${optionMap.get(valStr) ?? valStr} を削除`"
          class="ml-1 rounded-full hover:bg-blue-100"
          @click.stop="removeItem(valStr)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p
      v-if="errorMessage"
      :id="errorId"
      class="mt-1 px-3 text-sm text-error-primary">
      {{ errorMessage }}
    </p>

    <!-- Dropdown -->
    <Teleport to="body">
      <div v-bind="safeBind(machineApi.getPositionerProps())">
        <ul
          v-if="machineApi.open"
          v-bind="safeBind(machineApi.getContentProps())"
          class="absolute z-50 mt-1 max-h-[200px] w-(--reference-width) overflow-auto rounded-md border bg-white p-1 shadow-lg focus:outline-none">
          <li
            v-for="item in filteredOptions"
            :key="item.key"
            v-bind="safeBind(machineApi.getItemProps({ item }))"
            class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm text-text-primary outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-highlighted:bg-blue-100 data-highlighted:text-blue-500">
            <div class="mr-2 flex h-4 w-4 items-center justify-center">
              <CheckIcon
                v-if="selectedKeysSet.has(safeString(item.key))"
                class="h-4 w-4" />
            </div>
            <span class="truncate">{{ item.label }}</span>
          </li>

          <li
            v-if="props.options.length === 0"
            class="px-2 py-1.5 text-sm text-gray-700 select-none">
            {{ props.noItemsText || '項目がありません。' }}
          </li>
          <li
            v-else-if="filteredOptions.length === 0"
            class="px-2 py-1.5 text-sm text-gray-700 select-none">
            {{ props.noResultsText || '該当する項目がありません。' }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
