<script setup lang="ts">
import type { BaseInputCommonProps } from './BaseInput.types'
import BaseInputFrame from './BaseInputFrame.vue'
import { useBaseInput } from './useBaseInput'
import { computed } from 'vue'

interface Props extends BaseInputCommonProps {
  min?: number
  max?: number
  step?: number
  inputmode?: 'decimal' | 'numeric'
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  readonly: false,
  disabled: false,
  step: 1,
  inputmode: 'decimal',
  errorMessage: ''
})

const model = defineModel<number | null>({ required: true })

const emit = defineEmits<{
  (e: 'focus' | 'blur', value: FocusEvent): void
  (e: 'keydown', value: KeyboardEvent): void
  (e: 'input' | 'change', value: Event): void
}>()

const { inputId, isFieldRequired, errorMessageId, describedBy } =
  useBaseInput(props)

const displayValue = computed(() =>
  model.value === null || Number.isNaN(model.value) ? '' : String(model.value)
)
const hasValue = computed(() => displayValue.value !== '')

const handleInput = (event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  const rawValue = target.value

  if (rawValue === '') {
    model.value = null
    emit('input', event)
    return
  }

  const parsedValue = Number(rawValue)
  if (Number.isNaN(parsedValue)) return

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
    :has-value="hasValue"
    :input-id="inputId"
    :error-message="errorMessage"
    :error-message-id="errorMessageId">
    <template v-if="$slots.default" #prefix>
      <slot />
    </template>
    <template #default="{ inputProps }">
      <input
        :id="inputId"
        :class="[
          inputProps.class,
          'w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none not-focus-visible:placeholder:text-transparent',
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
        :aria-invalid="errorMessage ? 'true' : undefined"
        :aria-describedby="describedBy"
        :value="displayValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @change="handleChange" />
    </template>
  </BaseInputFrame>
</template>
