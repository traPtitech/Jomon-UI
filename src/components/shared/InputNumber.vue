<script setup lang="ts">
interface Props {
  modelValue: number
  required?: boolean
  disabled?: boolean
  placeholder?: string
  min?: number
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})
const emit = defineEmits<{
  (e: 'input', value: number): void
  (e: 'update:modelValue', modelValue: number): void
}>()

function handleInput(value: string) {
  emit('update:modelValue', Number(value))
}
</script>

<template>
  <input
    class="bg-background rounded border border-gray-300 py-1 px-2 disabled:cursor-not-allowed disabled:bg-gray-200"
    :disabled="props.disabled"
    :min="props.min"
    :placeholder="props.placeholder"
    :required="props.required"
    type="number"
    :value="props.modelValue"
    @input="handleInput(($event.target as HTMLInputElement).value)" />
</template>
