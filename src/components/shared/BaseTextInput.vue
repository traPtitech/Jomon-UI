<script setup lang="ts">
import BaseInputFrame from './BaseInputFrame.vue'
import { useForwardInputAttrs } from './useForwardInputAttrs'
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

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
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  type: 'text',
  readonly: false,
  disabled: false,
  textarea: false,
  rows: 6,
  errorMessage: ''
})

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  (e: 'focus' | 'blur', value: FocusEvent): void
  (e: 'keydown', value: KeyboardEvent): void
  (e: 'input' | 'change', value: Event): void
}>()

const {
  containerClass,
  containerStyle,
  describedByAttr,
  frameAttrs,
  inputAttrs,
  getControlAttrs
} = useForwardInputAttrs()

const textareaAttrs = computed(() => getControlAttrs('textarea'))

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const hasValue = computed(() => model.value !== '')
const isFieldRequired = computed(
  () => props.required && !(props.readonly || props.disabled)
)
const errorMessageId = computed(() =>
  props.errorMessage ? `${inputId.value}-error` : undefined
)
const describedBy = computed(() => {
  const ids = [describedByAttr.value, errorMessageId.value].filter(
    Boolean
  ) as string[]
  return ids.length ? ids.join(' ') : undefined
})

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
    :error-message="errorMessage"
    :error-message-id="errorMessageId"
    :class="containerClass"
    :style="containerStyle"
    v-bind="frameAttrs">
    <template v-if="$slots.default" #prefix>
      <slot />
    </template>
    <template #default>
      <textarea
        v-if="textarea"
        :id="inputId"
        :class="[
          'peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none not-focus-visible:placeholder:text-transparent',
          label ? 'pt-6' : 'pt-2',
          readonly || disabled ? 'cursor-not-allowed' : '',
          'resize-none'
        ]"
        v-bind="textareaAttrs"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :required="isFieldRequired"
        :aria-required="isFieldRequired ? 'true' : undefined"
        :aria-invalid="errorMessage ? 'true' : undefined"
        :aria-describedby="describedBy"
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
        :class="[
          'peer w-full border-none bg-transparent px-3 pb-2 ring-0 outline-none not-focus-visible:placeholder:text-transparent',
          label ? 'pt-6' : 'pt-2',
          readonly || disabled ? 'cursor-not-allowed' : ''
        ]"
        v-bind="inputAttrs"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :type="type"
        :required="isFieldRequired"
        :aria-required="isFieldRequired ? 'true' : undefined"
        :aria-invalid="errorMessage ? 'true' : undefined"
        :aria-describedby="describedBy"
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
