<script setup lang="ts">
interface Props {
  value?: number
  modelValue?: number
  required?: boolean
  placeholder?: string
  min?: number
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})
const emit = defineEmits<{
  (e: 'input', value: string): void
  (e: 'update:modelValue', modelValue: string): void
}>()

function handleInput(value: string) {
  if (props.value) {
    emit('input', value)
  } else {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <input
    class="bg-background rounded border border-gray-300 py-1 px-2"
    :min="props.min"
    :placeholder="props.placeholder"
    :required="props.required"
    type="number"
    :value="props.modelValue"
    @input="handleInput(($event.target as HTMLInputElement).value)" />
</template>
