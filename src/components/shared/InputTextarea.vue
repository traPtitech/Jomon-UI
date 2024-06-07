<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  modelValue: string
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
  id?: string
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
    :id="props.id"
    ref="textareaRef"
    class="bg-background min-h-32 rounded border border-gray-300 px-1"
    :placeholder="props.placeholder"
    :required="required"
    :value="props.modelValue"
    @input="handleInput(($event.target as HTMLTextAreaElement).value)" />
</template>
