<script setup lang="ts">
import BaseInputFrame from './BaseInputFrame.vue'
import { useBaseInput } from './composables/useBaseInput'
import { useForwardInputAttrs } from './useForwardInputAttrs'
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  inputmode?: 'decimal' | 'numeric'
  id?: string
  errorMessage?: string
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

const { describedByAttr, frameAttrs, inputAttrs } = useForwardInputAttrs({
  controlType: 'input'
})

const { inputId, isFieldRequired, errorMessageId, describedBy } = useBaseInput(
  props,
  describedByAttr
)

const displayValue = computed(() =>
  model.value === null || Number.isNaN(model.value) ? '' : String(model.value)
)
const hasValue = computed(() => displayValue.value !== '')

const handleInput = (event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) {
    return
  }
  const rawValue = target.value

  if (rawValue === '') {
    model.value = null
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
    :error-message="errorMessage"
    :error-message-id="errorMessageId"
    v-bind="frameAttrs">
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
        v-bind="inputAttrs"
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
