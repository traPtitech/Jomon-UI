<script setup lang="ts" generic="T extends string">
import { CheckIcon } from '@heroicons/vue/24/outline'

import type { SearchSelectOption } from './SearchSelect.types'

defineProps<{
  option: SearchSelectOption<T>
  selected: boolean
  highlighted: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()
</script>

<template>
  <button
    type="button"
    :class="[
      'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none',
      'hover:bg-blue-100 hover:text-blue-500',
      highlighted && 'bg-blue-100 text-blue-500',
      option.disabled && 'cursor-not-allowed opacity-50',
      selected && 'bg-blue-100',
    ]"
    :disabled="option.disabled"
    @click="!option.disabled && emit('select')">
    <span class="truncate">{{ option.key }}</span>
    <CheckIcon v-if="selected" class="ml-auto h-4 w-4" />
  </button>
</template>
