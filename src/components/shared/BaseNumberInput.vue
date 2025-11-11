<script setup lang="ts">
import BaseInputFrame from './BaseInputFrame.vue'
import { computed, useAttrs, useId } from 'vue'

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

const inputId = computed(() => props.id ?? useId())

const displayValue = computed(() =>
  model.value === null || Number.isNaN(model.value) ? '' : String(model.value)
)
const hasValue = computed(() => displayValue.value !== '')
const isFieldRequired = computed(
  () => props.required && !(props.readonly || props.disabled)
)

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
        :class="[
          'peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none not-focus-visible:placeholder:text-transparent',
          label ? 'pt-6' : 'pt-2',
          readonly || disabled ? 'cursor-not-allowed' : ''
        ]"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :inputmode="inputmode"
        :required="isFieldRequired"
        :aria-required="isFieldRequired ? 'true' : undefined"
        :value="displayValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @change="handleChange" />
    </template>
  </BaseInputFrame>
</template>
