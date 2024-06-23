<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  modelValue: string
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  autoFocus: false
})
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function handleInput(value: string) {
  emit('update:modelValue', value)
}

onMounted(() => {
  if (props.autoFocus) {
    if (textareaRef.value === null) return
    textareaRef.value.focus()
  }
})
</script>

<template>
  <textarea
    ref="textareaRef"
    class="bg-background min-h-32 rounded border border-gray-300 px-3 py-2"
    :placeholder="props.placeholder"
    :required="required"
    :value="props.modelValue"
    @input="handleInput(($event.target as HTMLTextAreaElement).value)" />
</template>
