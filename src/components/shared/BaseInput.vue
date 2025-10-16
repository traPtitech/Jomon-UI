<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  type?: string
}

// allow boolean for checkbox inputs
const model = defineModel<string | number | boolean | null>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  type: 'text'
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
  if (props.type === 'checkbox') {
    model.value = target.checked
    return
  }
  if (props.type === 'number') {
    model.value = Number(target.value)
    return
  }
  model.value = target.value
}

const handleKey = (e: KeyboardEvent) => {
  emit('keydown', e)
}

const valueForInput = computed<string | number | null>(() => {
  if (props.type === 'checkbox') return null
  if (props.type === 'number') return model.value as number | null
  return model.value as string | null
})

const checkedForCheckbox = computed(() => Boolean(model.value))
</script>

<template>
  <div
    class="flex rounded-lg border border-surface-secondary bg-white !ring-offset-2 transition-all duration-200 ease-in-out focus-within:!ring-2 focus-within:!ring-blue-500 focus-within:outline-none">
    <slot />
    <div class="relative w-full">
      <textarea
        v-if="type === 'textarea'"
        :id="`input-${props.label}`"
        ref="textareaRef"
        :class="`w-full border-none bg-transparent px-3 ${props.label ? 'pt-6' : 'pt-2'} peer pb-2 ring-0 outline-none [&:not(:focus-visible)]:placeholder:text-transparent`"
        rows="12"
        :placeholder="props.placeholder"
        :required="props.required"
        :value="valueForInput"
        @input="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKey" />
      
      <input
        v-else-if="props.type === 'checkbox'"
        :id="`input-${props.label}`"
        ref="inputRef"
        :class="`w-full border-none bg-transparent px-3 ${props.label ? 'pt-6' : 'pt-2'} peer pb-2 ring-0 outline-none [&:not(:focus-visible)]:placeholder:text-transparent`"
        :placeholder="props.placeholder"
        :required="props.required"
        type="checkbox"
        :checked="checkedForCheckbox"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur" />

      <input
        v-else
        :id="`input-${props.label}`"
        ref="inputRef"
        :class="`w-full border-none bg-transparent px-3 ${props.label ? 'pt-6' : 'pt-2'} peer pb-2 ring-0 outline-none [&:not(:focus-visible)]:placeholder:text-transparent`"
        :placeholder="props.placeholder"
        :required="props.required"
        :type="props.type"
        :value="valueForInput"
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
