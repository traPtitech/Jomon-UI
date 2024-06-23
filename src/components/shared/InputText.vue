<script setup lang="ts">
import { onMounted, ref } from 'vue'

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
const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void
}>()

function handleInput(value: string) {
  emit('update:modelValue', value)
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
    class="bg-white rounded border border-gray-300 py-1 px-2"
    :placeholder="props.placeholder"
    :required="props.required"
    :value="props.modelValue"
    @change="handleInput(($event.target as HTMLInputElement).value)" />
</template>
