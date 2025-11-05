<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  type?: string
  readonly?: boolean
}

const model = defineModel<string | number | null>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  type: 'text',
  readonly: false
})

const emit = defineEmits<{
  (e: 'focus' | 'blur'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()

const isFocused = ref(false)
const hasValue = computed(() => model.value !== '')
const isLabelFloating = computed(() => isFocused.value || hasValue.value)
const inputRef = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  model.value =
    props.type === 'number'
      ? target.value === ''
        ? null
        : Number(target.value)
      : target.value
}

const handleKey = (e: KeyboardEvent) => {
  emit('keydown', e)
}
</script>

<template>
  <div
    :class="`flex rounded-lg border border-surface-secondary !ring-offset-2 transition-all duration-200 ease-in-out focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:outline-none ${props.readonly ? 'cursor-not-allowed bg-surface-secondary' : ''}`">
    <slot />
    <div class="relative w-full">
      <textarea
        v-if="type === 'textarea'"
        :id="`input-${props.label}`"
        ref="textareaRef"
        :class="`w-full border-none bg-transparent px-3 ${props.label ? 'pt-6' : 'pt-2'} peer pb-2 ring-0 outline-none [&:not(:focus-visible)]:placeholder:text-transparent ${props.readonly ? 'cursor-not-allowed' : ''}`"
        rows="12"
        :placeholder="props.placeholder"
        :required="props.required"
        :value="model"
        @input="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKey" />

      <input
        v-else
        :readonly="props.readonly"
        :id="`input-${props.label}`"
        ref="inputRef"
        :class="`w-full border-none bg-transparent px-3 ${props.label ? 'pt-6' : 'pt-2'} peer pb-2 ring-0 outline-none [&:not(:focus-visible)]:placeholder:text-transparent ${props.readonly ? 'cursor-not-allowed' : ''}`"
        :placeholder="props.placeholder"
        :required="props.required"
        :type="props.type"
        :value="model"
        :min="type === 'number' ? 0 : undefined"
        @input="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKey" />
      <label
        :for="`input-${props.label}`"
        :class="[
          'pointer-events-none absolute left-3 text-text-secondary transition-all duration-200 ease-in-out peer-focus:text-blue-500',
          isLabelFloating
            ? 'top-1 text-xs font-medium'
            : type === 'textarea'
              ? 'top-8 -translate-y-1/2 text-base'
              : 'top-1/2 -translate-y-1/2 text-base'
        ]">
        {{ props.label }}
        <span v-if="props.required" class="text-red-500">*</span>
      </label>
    </div>
  </div>
</template>
