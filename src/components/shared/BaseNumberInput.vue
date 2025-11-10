<script setup lang="ts">
import BaseInputFrame from './BaseInputFrame.vue'
import { computed, getCurrentInstance, useAttrs } from 'vue'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  allowEmpty?: boolean
  inputmode?: 'decimal' | 'numeric'
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  readonly: false,
  disabled: false,
  step: 1,
  allowEmpty: true,
  inputmode: 'decimal'
})

const model = defineModel<number | null>({ required: true })

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
  () => props.id ?? `base-number-input-${String(instanceId)}`
)

const displayValue = computed(() =>
  model.value === null || Number.isNaN(model.value) ? '' : String(model.value)
)
const hasValue = computed(() => displayValue.value !== '')

const fieldClasses = computed(() => [
  'peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none [&:not(:focus-visible)]:placeholder:text-transparent',
  props.label ? 'pt-6' : 'pt-2',
  props.readonly || props.disabled ? 'cursor-not-allowed' : ''
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const rawValue = target.value

  if (rawValue === '') {
    model.value = props.allowEmpty ? null : 0
    emit('input', event)
    return
  }

  const parsedValue = Number(rawValue)
  if (Number.isNaN(parsedValue)) {
    return
  }
  model.value = parsedValue
  emit('input', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
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
    :input-id="inputId"
    v-bind="forwardedAttrs">
    <template v-if="$slots.default" #prefix>
      <slot />
    </template>
    <template #default>
      <input
        :id="inputId"
        :class="fieldClasses"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :inputmode="inputmode"
        :value="displayValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @change="handleChange" />
    </template>
  </BaseInputFrame>
</template>
