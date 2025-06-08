<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  label: string
  required?: boolean
  placeholder?: string
}

const model = defineModel<string>({ required: true })
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: ''
})

const isFocused = ref(false)
const hasValue = computed(() => model.value !== '')
const isLabelFloating = computed(() => isFocused.value || hasValue.value)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  model.value = target.value
}
</script>

<template>
  <div class="relative">
    <textarea
      :id="`input-${props.label}`"
      ref="textareaRef"
      class="w-full px-3 pt-6 pb-2 border border-gray-300 rounded-lg focus-visible:outline-none focus-visible:!ring-2 focus-visible:!ring-blue-500 !ring-offset-2 transition-all duration-200 ease-in-out bg-white peer [&:not(:focus-visible)]:placeholder:text-transparent"
      rows="12"
      :placeholder="props.placeholder"
      :required="props.required"
      :value="model"
      @input="handleChange"
      @focus="handleFocus"
      @blur="handleBlur" />
    <label
      :for="`input-${props.label}`"
      :class="[
        'absolute left-3 transition-all duration-200 ease-in-out pointer-events-none text-gray-500 peer-focus:text-blue-500',
        isLabelFloating
          ? 'top-1 text-xs font-medium'
          : 'top-8 -translate-y-1/2 text-base'
      ]">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
  </div>
</template>
