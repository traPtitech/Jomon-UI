<script setup lang="ts" generic="TValue extends string | number | null">
import { computed, useId } from 'vue'

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'

import { useSearchSelectMachine } from './composables/useSearchSelectMachine'
import SearchSelectPrimitiveInput from './primitives/SearchSelectPrimitiveInput.vue'
import SearchSelectPrimitiveItem from './primitives/SearchSelectPrimitiveItem.vue'
import SearchSelectPrimitiveList from './primitives/SearchSelectPrimitiveList.vue'
import SearchSelectPrimitiveRoot from './primitives/SearchSelectPrimitiveRoot.vue'
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

// Zag types are complex, but we can use them directly now
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
  <SearchSelectPrimitiveRoot v-bind="safeBind(machineApi.getRootProps())">
    <div v-bind="safeBind(machineApi.getControlProps())" class="group relative">
      <!-- Input -->
      <SearchSelectPrimitiveInput
        v-bind="safeBind(machineApi.getInputProps())"
        :placeholder="isFloating ? '' : placeholder"
        :aria-invalid="!!errorMessage"
        :aria-describedby="errorMessage ? errorId : undefined"
        @keydown="emit('keydown', $event)" />

      <!-- Floating Label -->
      <!-- eslint-disable vuejs-accessibility/label-has-for -->
      <label
        v-bind="safeBind(machineApi.getLabelProps())"
        class="pointer-events-none absolute left-3 transition-all duration-200"
        :class="[
          isFloating
            ? 'top-1 text-xs text-blue-500' // or text-gray-500 if not focused?
            : 'top-3.5 text-base text-gray-400',
          machineApi.focused ? 'text-blue-500' : 'text-gray-500',
        ]">
        {{ label }}
        <span v-if="required" class="ml-0.5 text-red-500">*</span>
      </label>

      <!-- Trigger Button (Chevron) -->
      <button
        type="button"
        v-bind="safeBind(machineApi.getTriggerProps())"
        class="absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" :id="errorId" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <!-- Dropdown Portal -->
    <Teleport to="body">
      <div v-bind="safeBind(machineApi.getPositionerProps())">
        <SearchSelectPrimitiveList
          v-if="machineApi.open"
          v-bind="safeBind(machineApi.getContentProps())">
          <SearchSelectPrimitiveItem
            v-for="item in filteredOptions"
            :key="item.key"
            v-bind="safeBind(machineApi.getItemProps({ item }))">
            <div class="flex items-center justify-between">
              <span
                :class="{
                  'font-semibold': selectedKeysSet.has(
                    serializeOptionKey(item.key)
                  ),
                }">
                {{ item.label }}
              </span>
              <CheckIcon
                v-if="selectedKeysSet.has(serializeOptionKey(item.key))"
                class="h-4 w-4 text-blue-600" />
            </div>
          </SearchSelectPrimitiveItem>

          <!-- No Items / No Results -->
          <li
            v-if="props.options.length === 0"
            class="px-4 py-2 text-sm text-gray-500">
            {{ props.noItemsText || '項目がありません。' }}
          </li>
          <li
            v-else-if="filteredOptions.length === 0"
            class="px-4 py-2 text-sm text-gray-500">
            {{ props.noResultsText || '該当する項目がありません。' }}
          </li>
        </SearchSelectPrimitiveList>
        <!-- Status for Screen Readers -->
        <div
          class="sr-only"
          role="status"
          aria-live="polite">
          <span v-if="machineApi.open && props.options.length === 0">
            {{ props.noItemsText || '項目がありません。' }}
          </span>
          <span v-else-if="machineApi.open && filteredOptions.length === 0">
            {{ props.noResultsText || '該当する項目がありません。' }}
          </span>
        </div>
      </div>
    </Teleport>
  </SearchSelectPrimitiveRoot>
</template>
