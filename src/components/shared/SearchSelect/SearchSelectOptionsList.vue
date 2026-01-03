<script setup lang="ts" generic="T extends string | number">
import {
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

import type { SearchSelectOption } from './types'

defineProps<{
  filteredOptions: SearchSelectOption<T>[]
  searchTerm: string
  noResultsText?: string
}>()

const emit = defineEmits<{
  (e: 'after-leave'): void
}>()
</script>

<template>
  <TransitionRoot
    leave="transition ease-in duration-100"
    leave-from="opacity-100"
    leave-to="opacity-0"
    @after-leave="emit('after-leave')">
    <ComboboxOptions
      class="absolute z-50 mt-1 box-border max-h-60 w-full overflow-auto rounded-md border bg-white p-1 shadow-lg focus:outline-none">
      <li
        v-if="filteredOptions.length === 0 && searchTerm !== ''"
        class="relative cursor-default px-2 py-1.5 text-sm text-gray-700 select-none"
        aria-disabled="true">
        {{ noResultsText || '該当する項目がありません。' }}
      </li>

      <ComboboxOption
        v-for="option in filteredOptions"
        :key="option.key"
        :value="option.key"
        :disabled="!!option.disabled"
        v-slot="{ selected }"
        class="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm select-none ui-disabled:cursor-not-allowed ui-disabled:opacity-40 ui-active:ui-not-disabled:bg-blue-100 ui-not-active:ui-not-disabled:text-text-primary">
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
      </ComboboxOption>
    </ComboboxOptions>
  </TransitionRoot>
</template>
