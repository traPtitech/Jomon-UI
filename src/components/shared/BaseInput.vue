<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
  type?: string
}

const model = defineModel<string | number>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  type: 'text'
})

const emit = defineEmits<{
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'keydown', value: KeyboardEvent): void
}>()

const isFocused = ref(false)
const hasValue = computed(() => model.value !== '')
const isLabelFloating = computed(() => isFocused.value || hasValue.value)
const inputRef = ref<HTMLInputElement | null>(null)

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
  model.value = target.value
}

const handleKey = (e: KeyboardEvent) => {
  emit('keydown', e)
}
</script>

<template>
  <div class="relative">
    <input
      :id="`input-${props.label}`"
      ref="inputRef"
      class="w-full px-3 pt-6 pb-2 border border-gray-300 rounded-lg focus-visible:outline-none focus-visible:!ring-2 focus-visible:!ring-blue-500 !ring-offset-2 transition-all duration-200 ease-in-out bg-white peer [&:not(:focus-visible)]:placeholder:text-transparent"
      :placeholder="props.placeholder"
      :required="props.required"
      :type="props.type"
      :value="model"
      :min="0"
      @input="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKey" />
    <label
      :for="`input-${props.label}`"
      :class="[
        'absolute left-3 transition-all duration-200 ease-in-out pointer-events-none text-gray-500 peer-focus:text-blue-500',
        isLabelFloating
          ? 'top-1 text-xs font-medium'
          : 'top-1/2 -translate-y-1/2 text-base'
      ]">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
  </div>
</template>
