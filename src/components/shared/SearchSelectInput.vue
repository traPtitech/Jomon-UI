<script setup lang="ts">
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import BaseTextInput from './BaseInput/BaseTextInput.vue'

const searchTerm = defineModel<string>('searchTerm', { required: true })

const props = defineProps<{
  isOptionsOpened: boolean
  label: string
  placeholder: string
  disabled: boolean
  required: boolean
}>()

const emit = defineEmits<{
  (e: 'focus' | 'input' | 'clickToggleButton'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()
</script>

<template>
  <div class="relative">
    <BaseTextInput
      v-model="searchTerm"
      :label="label"
      :class="['pr-8', disabled && 'cursor-not-allowed opacity-50']"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      @focus="() => emit('focus')"
      @input="() => emit('input')"
      @keydown="e => emit('keydown', e)">
      <MagnifyingGlassIcon class="ml-3 w-6 text-text-secondary" />
    </BaseTextInput>
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-2"
      :disabled="disabled"
      :aria-label="disabled ? undefined : 'オプションを表示'"
      :aria-expanded="disabled ? undefined : isOptionsOpened"
      @click="() => !props.disabled && emit('clickToggleButton')">
      <ChevronDownIcon
        :class="[
          'h-4 w-4 text-text-secondary transition-transform',
          isOptionsOpened && 'rotate-180',
        ]" />
    </button>
  </div>
</template>
