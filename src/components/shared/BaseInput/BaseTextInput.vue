<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import {
  type BaseInputCommonProps,
  type TextAutocomplete,
  type TextInputMode,
  type TextInputType,
} from './BaseInput.types'
import BaseInputFrame from './BaseInputFrame.vue'
import { useBaseInput } from './useBaseInput'

interface Props extends BaseInputCommonProps {
  type?: TextInputType
  textarea?: boolean
  rows?: number
  inputmode?: TextInputMode
  autocomplete?: TextAutocomplete
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  type: 'text',
  readonly: false,
  disabled: false,
  textarea: false,
  rows: 6,
  errorMessage: '',
  inputAttrs: () => ({}),
})

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  (e: 'focus' | 'blur', value: FocusEvent): void
  (e: 'keydown', value: KeyboardEvent): void
  (e: 'input' | 'change', value: Event): void
}>()

const { inputId, isFieldRequired, errorMessageId, describedBy } =
  useBaseInput(props)

const hasValue = computed(() => model.value !== '')

const inputRef = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>(
  'inputRef'
)

const handleInput = (event: Event) => {
  const target = event.target
  if (
    !(target instanceof HTMLInputElement) &&
    !(target instanceof HTMLTextAreaElement)
  ) {
    return
  }
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

defineExpose({
  focus: () => {
    inputRef.value?.focus()
  },
})
</script>

<template>
  <BaseInputFrame
    :label="label"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :has-value="hasValue"
    :is-textarea="textarea"
    :input-id="inputId"
    :error-message="errorMessage"
    :error-message-id="errorMessageId">
    <template v-if="$slots.default" #prefix>
      <slot />
    </template>
    <template #default="{ inputProps }">
      <component
        :is="textarea ? 'textarea' : 'input'"
        :id="inputId"
        ref="inputRef"
        :class="[
          inputProps.class,
          'w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none not-focus-visible:placeholder:text-transparent',
          label ? 'pt-6' : 'pt-2',
          readonly || disabled ? 'cursor-not-allowed' : '',
        ]"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :type="textarea ? undefined : type"
        :rows="textarea ? rows : undefined"
        :required="isFieldRequired"
        :aria-required="isFieldRequired ? 'true' : undefined"
        :aria-invalid="errorMessage ? 'true' : undefined"
        :aria-describedby="describedBy"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        :value="model"
        v-bind="inputAttrs"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @change="handleChange" />
    </template>
  </BaseInputFrame>
</template>
