<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  modelValue: number
  required?: boolean
  placeholder?: string
  min?: number
  autoFocus?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  min: 0,
  autoFocus: false
})
const emit = defineEmits<{
  (e: 'input', value: number): void
  (e: 'update:modelValue', modelValue: number): void
}>()
const inputRef = ref<HTMLInputElement | null>(null)

function handleInput(value: string) {
  emit('update:modelValue', Number(value))
}

onMounted(() => {
  if (props.autoFocus) {
    if (inputRef.value === null) return
    inputRef.value.focus()
  }
})
</script>

<template>
  <input
    ref="inputRef"
    class="bg-background rounded border border-gray-300 py-1 px-2"
    :min="props.min"
    :placeholder="props.placeholder"
    :required="props.required"
    type="number"
    :value="props.modelValue"
    @input="handleInput(($event.target as HTMLInputElement).value)" />
</template>
