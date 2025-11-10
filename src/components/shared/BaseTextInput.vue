<script setup lang="ts">
import BaseInputFrame from './BaseInputFrame.vue'
import { computed, getCurrentInstance, useAttrs } from 'vue'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  type?: string
  readonly?: boolean
  disabled?: boolean
  textarea?: boolean
  rows?: number
  inputmode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  autocomplete?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  type: 'text',
  readonly: false,
  disabled: false,
  textarea: false,
  rows: 6
})

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  (e: 'focus' | 'blur', value: FocusEvent): void
  (e: 'keydown', value: KeyboardEvent): void
  (e: 'input' | 'change', value: Event): void
}>()

const attrs = useAttrs()
const forwardedAttrs = computed(() => {
  const rest = { ...(attrs as Record<string, unknown>) }
  delete rest.class
  return rest
})

const instanceId = getCurrentInstance()?.uid ?? Math.random()
const inputId = computed(
  () => props.id ?? `base-text-input-${String(instanceId)}`
)
const hasValue = computed(() => model.value !== '')
const isFieldRequired = computed(
  () => props.required && !(props.readonly || props.disabled)
)

const fieldClasses = computed(() => [
  'peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none [&:not(:focus-visible)]:placeholder:text-transparent',
  props.label ? 'pt-6' : 'pt-2',
  props.readonly || props.disabled ? 'cursor-not-allowed' : '',
  props.textarea ? 'resize-none' : ''
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  model.value = target.value
  emit('input', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleChange = (event: Event) => {
  emit('change', event)
}
</script>

<template>
  <BaseInputFrame
    :label="label"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :placeholder="placeholder"
    :has-value="hasValue"
    :is-textarea="textarea"
    :input-id="inputId"
    v-bind="forwardedAttrs">
    <template v-if="$slots.default" #prefix>
      <slot />
    </template>
    <template #default>
      <textarea
        v-if="textarea"
        :id="inputId"
        :class="fieldClasses"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :required="isFieldRequired"
        :aria-required="isFieldRequired ? 'true' : undefined"
        :rows="rows"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :value="model"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @change="handleChange" />
      <input
        v-else
        :id="inputId"
        :class="fieldClasses"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :type="type"
        :required="isFieldRequired"
        :aria-required="isFieldRequired ? 'true' : undefined"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        :value="model"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @change="handleChange" />
    </template>
  </BaseInputFrame>
</template>
