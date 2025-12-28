<script setup lang="ts" generic="TValue extends string | number | null">
import { computed, useId } from 'vue'

import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import { useSearchSelectMachine } from './composables/useSearchSelectMachine'
// Primitives removed, using inline elements for style control
// import SearchSelectPrimitiveInput from './primitives/SearchSelectPrimitiveInput.vue'
// import SearchSelectPrimitiveItem from './primitives/SearchSelectPrimitiveItem.vue'
// import SearchSelectPrimitiveList from './primitives/SearchSelectPrimitiveList.vue'
// import SearchSelectPrimitiveRoot from './primitives/SearchSelectPrimitiveRoot.vue'
import type { SearchSelectCommonProps, SearchSelectEmit } from './types'
import { safeBind, serializeOptionKey } from './utils'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: false,
  errorMessage: undefined,
})

const emit = defineEmits<SearchSelectEmit<TValue | null>>()
const model = defineModel<TValue | null>({ required: true })

const id = useId()
const errorId = `${id}-error`

const { api, filteredOptions } = useSearchSelectMachine<NonNullable<TValue>>(
  {
    id,
    options: computed(() => props.options),
    multiple: false,
    disabled: computed(() => props.disabled),
    placeholder: computed(() => props.placeholder),
    modelValue: computed(() => model.value),
    filterFunction: props.filterFunction,
    resetOnSelect: computed(() => props.resetOnSelect),
  },
  // Adapter for emit to match types
  (event, value) => {
    if (event === 'close') {
      emit('close')
      return
    }
    if (!Array.isArray(value)) {
      emit(event, value ?? null)
    }
  }
)

const machineApi = computed(() => api.value)

const selectedKeysSet = computed(() => {
  return new Set(machineApi.value.value)
})

// Floating Label Condition
const isFloating = computed(() => {
  const apiVal = machineApi.value
  return (
    apiVal.inputValue.length > 0 || apiVal.value.length > 0 || apiVal.focused
  )
})
</script>

<template>
  <div v-bind="safeBind(machineApi.getRootProps())" class="relative w-full group">
    <!-- Input Wrapper -->
    <div
      v-bind="safeBind(machineApi.getControlProps())"
      :class="[
        'flex rounded-lg border border-surface-secondary ring-offset-2! transition-all duration-200 ease-in-out focus-within:ring-2! focus-within:ring-blue-500! focus-within:outline-none',
        disabled ? 'cursor-not-allowed bg-surface-secondary' : 'bg-white',
      ]"
    >
      <!-- Prefix Icon -->
      <div class="pl-3 flex items-center justify-center">
         <MagnifyingGlassIcon class="w-6 text-text-secondary" />
      </div>

      <div class="relative w-full">
        <!-- Input -->
        <input
          v-bind="safeBind(machineApi.getInputProps())"
          class="peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none text-base text-text-primary"
          :class="[label ? 'pt-6' : 'pt-2', disabled ? 'cursor-not-allowed' : '']"
          :placeholder="isFloating ? placeholder : ''"
          :aria-invalid="!!errorMessage"
          :aria-describedby="errorMessage ? errorId : undefined"
          @keydown="emit('keydown', $event)" 
        />

        <!-- Floating Label -->
        <label
          v-if="label"
          v-bind="safeBind(machineApi.getLabelProps())"
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

      <!-- Trigger Button -->
      <button
        type="button"
        v-bind="safeBind(machineApi.getTriggerProps())"
        class="flex items-center pr-2"
      >
        <ChevronUpDownIcon class="h-4 w-4 text-text-secondary" aria-hidden="true" />
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" :id="errorId" class="mt-1 px-3 text-sm text-error-primary">
      {{ errorMessage }}
    </p>

    <!-- Dropdown Portal -->
    <Teleport to="body">
      <div v-bind="safeBind(machineApi.getPositionerProps())">
        <ul
          v-if="machineApi.open"
          v-bind="safeBind(machineApi.getContentProps())"
          class="absolute z-50 mt-1 w-[var(--reference-width)] overflow-auto rounded-md border bg-white shadow-lg max-h-[200px] p-1 focus:outline-none"
        >
          <li
            v-for="item in filteredOptions"
            :key="item.key"
            v-bind="safeBind(machineApi.getItemProps({ item }))"
            class="relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-500 text-text-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
          >
            <span
              class="truncate flex-1"
              :class="{
                'font-medium': selectedKeysSet.has(serializeOptionKey(item.key)),
              }"
            >
              {{ item.label }}
            </span>
            <CheckIcon
              v-if="selectedKeysSet.has(serializeOptionKey(item.key))"
              class="ml-auto h-4 w-4" 
            />
          </li>

          <!-- No Items / No Results -->
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
