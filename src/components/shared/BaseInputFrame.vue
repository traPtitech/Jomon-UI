<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  isTextarea?: boolean
  hasValue?: boolean
  inputId: string
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  readonly: false,
  disabled: false,
  isTextarea: false,
  hasValue: false,
  errorMessage: ''
})

const attrs = useAttrs()
const isFocused = ref(false)

const forwardedAttrs = computed(() => {
  const rest = { ...(attrs as Record<string, unknown>) }
  delete rest.class
  return rest
})

const rootClasses = computed(() => [
  'flex rounded-lg border border-surface-secondary !ring-offset-2 transition-all duration-200 ease-in-out focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:outline-none',
  props.readonly || props.disabled
    ? 'cursor-not-allowed bg-surface-secondary'
    : 'bg-white',
  attrs.class
])

const isRequired = computed(
  () => props.required && !(props.readonly || props.disabled)
)
const isLabelFloating = computed(
  () => !!props.label && (isFocused.value || props.hasValue)
)
const labelPositionClass = computed(() => {
  if (!props.label) return ''
  if (isLabelFloating.value) {
    return 'top-1 text-xs font-medium'
  }
  return props.isTextarea
    ? 'top-8 -translate-y-1/2 text-base'
    : 'top-1/2 -translate-y-1/2 text-base'
})

const handleFocusIn = () => {
  isFocused.value = true
}

const handleFocusOut = () => {
  isFocused.value = false
}
</script>

<template>
  <div
    :class="rootClasses"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    v-bind="forwardedAttrs">
    <slot name="prefix" />
    <div class="relative w-full">
      <slot />
      <label
        v-if="label"
        :for="inputId"
        :class="[
          'pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500',
          labelPositionClass
        ]">
        {{ label }}
        <span v-if="isRequired" class="text-red-500">*</span>
      </label>
      <p v-if="errorMessage" class="px-3 pb-2 text-sm text-error-primary">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
