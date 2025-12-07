<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import BaseTextInput from '../BaseInput/BaseTextInput.vue'
import type { MenuState } from './composables/useSearchSelect'

defineProps<{
  label: string
  placeholder?: string | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
  menuState: MenuState
  ariaExpanded?: boolean
  ariaControls?: string
  ariaActivedescendant?: string
}>()

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  (e: 'focus' | 'toggle-menu' | 'compositionstart' | 'compositionend'): void
  (e: 'input', value: Event): void
  (e: 'keydown', value: KeyboardEvent): void
}>()

const inputRef = useTemplateRef<InstanceType<typeof BaseTextInput>>('inputRef')

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus,
})

const handleToggle = () => {
  emit('toggle-menu')
  focus()
}
</script>

<template>
  <div class="relative">
    <BaseTextInput
      ref="inputRef"
      v-model="model"
      :label="label"
      :class="['pr-8', disabled && 'cursor-not-allowed opacity-50']"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :input-attrs="{
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-autocomplete': 'list',
        'aria-expanded': ariaExpanded,
        'aria-controls': ariaControls,
        'aria-activedescendant': ariaActivedescendant,
      }"
      @focus="emit('focus')"
      @input="emit('input', $event)"
      @keydown="emit('keydown', $event)"
      @compositionstart="emit('compositionstart')"
      @compositionend="emit('compositionend')">
      <MagnifyingGlassIcon class="ml-3 w-6 text-text-secondary" />
    </BaseTextInput>
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-2"
      :disabled="disabled"
      aria-label="候補の一覧を開閉"
      :aria-expanded="ariaExpanded"
      :aria-controls="ariaControls"
      @click="handleToggle">
      <ChevronDownIcon
        :class="[
          'h-4 w-4 text-text-secondary transition-transform',
          menuState !== 'close' && 'rotate-180',
        ]" />
    </button>
  </div>
</template>
