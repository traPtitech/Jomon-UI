<script setup lang="ts" generic="TValue extends string | number | null">
import { computed, onMounted, useId } from 'vue'

import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'

import { safeBind } from '@/components/shared/utils'

import { useSearchSelectMachine } from './composables/useSearchSelectMachine'
import SearchSelectPrimitiveInput from './primitives/SearchSelectPrimitiveInput.vue'
import SearchSelectPrimitiveItem from './primitives/SearchSelectPrimitiveItem.vue'
import SearchSelectPrimitiveList from './primitives/SearchSelectPrimitiveList.vue'
import SearchSelectPrimitiveRoot from './primitives/SearchSelectPrimitiveRoot.vue'
import type { SearchSelectCommonProps, SearchSelectEmit } from './types'

const props = withDefaults(defineProps<SearchSelectCommonProps<TValue>>(), {
  placeholder: '検索',
  disabled: false,
  required: false,
  resetOnSelect: false,
  theme: () => ({ themeColor: 'blue' }),
  errorMessage: undefined,
})

const emit = defineEmits<SearchSelectEmit<TValue | null>>()
const model = defineModel<TValue | null>({ required: true })

const id = useId()

const { api, filteredOptions } = useSearchSelectMachine<NonNullable<TValue>>(
  {
    id,
    options: computed(() => props.options),
    multiple: false,
    disabled: computed(() => props.disabled),
    placeholder: computed(() => props.placeholder),
    modelValue: computed(() => model.value),
    filterFunction: props.filterFunction,
  },
  // Adapter for emit to match types
  (event, value) => {
    if (!Array.isArray(value)) {
      emit(event, value)
    }
  }
)

// Zag types are complex, but we can use them directly now
const machineApi = computed(() => api.value)

onMounted(() => {})
</script>

<template>
  <SearchSelectPrimitiveRoot v-bind="safeBind(machineApi.getRootProps())">
    <div v-bind="safeBind(machineApi.getControlProps())" class="group relative">
      <!-- Input -->
      <SearchSelectPrimitiveInput
        v-bind="safeBind(machineApi.getInputProps())"
        :id="id"
        class="peer h-12 border-gray-300 pt-6 pb-2 focus:border-blue-500 focus:ring-blue-500"
        placeholder=" " />
      <!-- Note: placeholder=" " (space) is required for peer-placeholder-shown to work -->

      <!-- Floating Label -->
      <label
        v-bind="safeBind(machineApi.getLabelProps())"
        :for="id"
        class="pointer-events-none absolute top-2 left-3 text-gray-500 transition-all duration-200 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500">
        {{ label }}
        <span v-if="required" class="ml-0.5 text-red-500">*</span>
      </label>

      <!-- Trigger Button (Chevron) -->
      <button
        v-bind="safeBind(machineApi.getTriggerProps())"
        class="absolute inset-y-0 right-0 flex items-center pr-2"
        tabindex="-1">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 text-sm text-red-600">
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
                  'font-semibold': machineApi.value.includes(String(item.key)),
                }">
                {{ item.label }}
              </span>
              <CheckIcon
                v-if="machineApi.value.includes(String(item.key))"
                class="h-4 w-4 text-blue-600" />
            </div>
          </SearchSelectPrimitiveItem>

          <!-- No Results -->
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
