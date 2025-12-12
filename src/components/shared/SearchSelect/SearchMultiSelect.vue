<script setup lang="ts" generic="TValue extends string | number">
import { computed, useId } from 'vue'

import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

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
  resetOnSelect: true,
  theme: () => ({ themeColor: 'blue' }),
  errorMessage: undefined,
})

const emit = defineEmits<SearchSelectEmit<TValue[]>>()
const model = defineModel<TValue[]>({ required: true })

const id = useId()

const { api, filteredOptions } = useSearchSelectMachine<TValue>(
  {
    id,
    options: computed(() => props.options),
    multiple: true,
    disabled: computed(() => props.disabled),
    placeholder: computed(() => props.placeholder),
    modelValue: computed(() => model.value),
    filterFunction: props.filterFunction,
  },
  (event, value) => {
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
    map.set(serializeOptionKey(option.key), option.label)
  }
  return map
})

// Remove tag handler
const removeItem = (valueStr: string) => {
  // Use machine api to clear value
  // api.value is the object. clearValue is method.
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
  if (props.disabled) return

  // Backspace deletion for MultiSelect
  // If input is empty and we have values, remove the last one.
  if (e.key === 'Backspace' && machineApi.value.inputValue === '') {
    const currentValues = machineApi.value.value // string[] of keys
    if (currentValues.length > 0) {
      // machineApi.value.value are string keys.
      // We need to find the last one and remove it.
      const lastKeyStr = currentValues[currentValues.length - 1]
      api.value.clearValue(lastKeyStr)
    }
  }
}
</script>

<template>
  <SearchSelectPrimitiveRoot v-bind="safeBind(machineApi.getRootProps())">
    <div v-bind="safeBind(machineApi.getControlProps())" class="group relative">
      <SearchSelectPrimitiveInput
        v-bind="safeBind(machineApi.getInputProps())"
        :id="id"
        :placeholder="isFloating ? '' : placeholder"
        @keydown="handleInputKeydown" />
      <!-- We can't rely solely on peer-placeholder-shown if we want 'value.length > 0' to trigger floating.
           So we explicitly control label classes based on isFloating.
      -->

      <label
        v-bind="safeBind(machineApi.getLabelProps())"
        :for="id"
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

      <button
        v-bind="safeBind(machineApi.getTriggerProps())"
        class="absolute inset-y-0 right-0 flex items-center pr-2"
        tabindex="-1">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
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
        class="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
        {{ optionMap.get(valStr) ?? valStr }}
        <button
          type="button"
          class="ml-1 rounded-full hover:bg-gray-300"
          @click.stop="removeItem(valStr)">
          <XMarkIcon class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>

    <Teleport to="body">
      <div v-bind="safeBind(machineApi.getPositionerProps())">
        <SearchSelectPrimitiveList
          v-if="machineApi.open"
          v-bind="safeBind(machineApi.getContentProps())">
          <SearchSelectPrimitiveItem
            v-for="item in filteredOptions"
            :key="item.key"
            v-bind="safeBind(machineApi.getItemProps({ item }))">
            <div class="flex items-center">
              <!-- Checkbox style for multiselect? or just checkmark -->
              <div
                class="mr-2 flex h-4 w-4 items-center justify-center rounded border border-gray-300">
                <CheckIcon
                  v-if="machineApi.value.includes(serializeOptionKey(item.key))"
                  class="h-3 w-3 text-blue-600" />
              </div>
              <span
                :class="{
                  'font-semibold': machineApi.value.includes(
                    serializeOptionKey(item.key)
                  ),
                }">
                {{ item.label }}
              </span>
            </div>
          </SearchSelectPrimitiveItem>

          <div
            v-if="filteredOptions.length === 0"
            class="px-4 py-2 text-sm text-gray-500">
            {{ props.noResultsText || '該当する項目がありません。' }}
          </div>
        </SearchSelectPrimitiveList>
      </div>
    </Teleport>
  </SearchSelectPrimitiveRoot>
</template>
