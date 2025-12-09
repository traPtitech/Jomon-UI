<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

import BaseTextInput from '../BaseInput/BaseTextInput.vue'

const props = defineProps<{
  label: string
  placeholder?: string | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
  isOpen: boolean
  ariaControls?: string
  ariaActivedescendant?: string
}>()

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  (e: 'toggle-menu' | 'compositionstart' | 'compositionend'): void
  (e: 'focus', value: FocusEvent): void
  (e: 'input', value: Event): void
  (e: 'keydown', value: KeyboardEvent): void
}>()

const inputRef = useTemplateRef<InstanceType<typeof BaseTextInput>>('inputRef')

const focus = () => {
  inputRef.value?.focus()
}

const select = () => {
  inputRef.value?.select()
}

defineExpose({
  focus,
  select,
})

const handleToggle = () => {
  emit('toggle-menu')
  if (!props.isOpen) {
    focus()
  }
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
        // Combobox Pattern Attributes
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-autocomplete': 'list',
        'aria-expanded': isOpen,
        'aria-controls': ariaControls,
        'aria-activedescendant': ariaActivedescendant,
      }"
      @focus="emit('focus', $event)"
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
      @mousedown.prevent
      @click="handleToggle">
      <ChevronDownIcon
        :class="[
          'h-4 w-4 text-text-secondary transition-transform',
          isOpen && 'rotate-180',
        ]" />
    </button>
  </div>
</template>
